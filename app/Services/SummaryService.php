<?php

namespace App\Services;

use App\Enums\PaymentType;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
Use Illuminate\Support\Collection;



/**
 * Service responsible for calculating financial summaries.
 *
 * This service aggregates income from payments and other income sources,
 * as well as expenses from books, uniforms, and general expenses,
 * within a given date range.
 */
class SummaryService
{
    /**
     * Calculate total income grouped by type within a date range.
     *
     * Combines income from defined PaymentType cases and dynamic income types.
     *
     * @param string $startDate Start date (Y-m-d)
     * @param string $endDate End date (Y-m-d)
     * @return Collection a Collection with income types as keys and total amounts as values.
     */
    public function getTotalIncome(string $startDate, string $endDate): Collection
    {

        $paymentTypesTable = collect(PaymentType::cases())
            ->map(fn($case) => "SELECT '{$case->value}' AS type ")
            ->implode('UNION ALL ');

        $query = "
            SELECT
                types.type,
                COALESCE(SUM(payments.value), 0) AS total
            FROM ({$paymentTypesTable}) AS types
            LEFT JOIN payments ON payments.type = types.type
                AND payments.date BETWEEN ? AND ?
            GROUP BY types.type

            UNION ALL

            SELECT
                'الايرادات المتنوعة' AS type,
                COALESCE(SUM(incomes.value), 0) AS total
            FROM
            incomes
            WHERE
            incomes.date BETWEEN ? AND ?

        ";

        $results = DB::select($query, [$startDate, $endDate, $startDate, $endDate]);

        $totals = collect($results)
            ->keyBy('type')
            ->map(fn($item) => $item->total);

        return $totals;
    }

    /**
     * Calculate total expenses for books, uniforms, and general expenses within a date range.
     *
     * @param string $startDate Start date (Y-m-d)
     * @param string $endDate End date (Y-m-d)
     * @return array  an array containing totals for 'books', 'uniforms', and 'expenses'.
     */
    public function getTotalExpenses($startDate, $endDate): array
    {
        $query = "
            SELECT
                (SELECT COALESCE(SUM(buy_price * imported_quantity), 0)
                 FROM books
                 WHERE created_at BETWEEN ? AND ?) as books,

                (SELECT COALESCE(SUM(buy_price * imported_quantity), 0)
                 FROM uniforms
                 WHERE created_at BETWEEN ? AND ?) as uniforms,

                (SELECT COALESCE(SUM(value), 0)
                 FROM expenses
                 WHERE date BETWEEN ? AND ?) as expenses
        ";

        $result = DB::selectOne($query, [
            $startDate, $endDate,
            $startDate, $endDate,
            $startDate, $endDate
        ]);

        return [
            'books' => (float) $result->books,
            'uniforms' => (float) $result->uniforms,
            'expenses' => (float) $result->expenses,
        ];
    }
}
