<?php

namespace App\Services;

use App\Enums\PaymentType;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use Psy\Util\Json;


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
            'books' => (float)$result->books,
            'uniforms' => (float)$result->uniforms,
            'expenses' => (float)$result->expenses,
        ];
    }

    /**
     * Calculate total expenses and incomes for each month from the past 12 months
     * @returns array - An array including the monthly totals and the total for the past year
     */

    public function getMonthlySummary(): array
    {
        $startDate = now()->subMonth(11)->firstOfMonth();
        $endDate = now()->endOfMonth();

        $incomes = DB::table('payments')
            ->selectRaw('YEAR(date) as year, MONTH(date) as month, SUM(value) as value')
            ->whereBetween('date', [$startDate, $endDate])
            ->groupBy('year', 'month')
            ->get();

        $expenses = DB::table('expenses')
            ->selectRaw('YEAR(date) as year, MONTH(date) as month, SUM(value) as value')
            ->whereBetween('date', [$startDate, $endDate])
            ->groupBy('year', 'month')
            ->get();

        $bookExpenses = DB::table("books")
            ->selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, SUM(buy_price * imported_quantity) as value')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('year', 'month')
            ->get();

        $uniformExpenses = DB::table('uniforms')
            ->selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, SUM(buy_price * imported_quantity) as value')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('year', 'month')
            ->get();

        $monthlyIncomes = $incomes
            ->groupBy(fn($r) => "{$r->year}-{$r->month}")
            ->map(fn($g) => $g->sum('value'));

        $monthlyExpenses = collect()
            ->merge($expenses)
            ->merge($uniformExpenses)
            ->merge($bookExpenses)
            ->groupBy(fn($r) => "{$r->year}-{$r->month}")
            ->map(fn($g) => $g->sum('value'));

        $results = [
            "monthly" => collect()
        ];

        while ($startDate <= $endDate) {
            $key = "{$startDate->year}-{$startDate->month}";

            $results["monthly"]->push([
                'year' => $startDate->year,
                'month' => Carbon::create(null, $startDate->month, 1)->translatedFormat('F'),
                'incomes' => (float)($monthlyIncomes[$key] ?? 0),
                'expenses' => (float)($monthlyExpenses[$key] ?? 0),
            ]);
            $startDate->addMonth();
        }
        $results["total"] =
            [
                "incomes" => $results['monthly']->sum('incomes'),
                "expenses" => $results['monthly']->sum('expenses')
            ];

        return $results;
    }

}
