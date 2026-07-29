<?php

namespace App\Services;

use App\Models\BankAccount;

class BankAccountReportService
{
    public function getReportData(
        string $academicYear,
        ?string $startDate = null,
        ?string $endDate = null,
    ): array {
        $transactions = BankAccount::query()
            ->where('academic_year', $academicYear)
            ->when($startDate, fn ($query) => $query->whereDate('date', '>=', $startDate))
            ->when($endDate, fn ($query) => $query->whereDate('date', '<=', $endDate))
            ->orderBy('date')
            ->orderBy('id')
            ->get();

        $depositsTotal = (float) $transactions
            ->whereIn('type', ['ايداع', 'إيداع'])
            ->sum('value');
        $withdrawalsTotal = (float) $transactions
            ->where('type', 'سحب')
            ->sum('value');

        return [
            'academic_year' => $academicYear,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'transactions' => $transactions->map(fn (BankAccount $transaction) => [
                'id' => $transaction->id,
                'date' => $transaction->date,
                'type' => $transaction->type,
                'value' => (float) $transaction->value,
                'deposit' => in_array($transaction->type, ['ايداع', 'إيداع'], true)
                    ? (float) $transaction->value
                    : 0,
                'withdrawal' => $transaction->type === 'سحب'
                    ? (float) $transaction->value
                    : 0,
                'manager_name' => $transaction->manager_name,
                'notes' => $transaction->notes ?: 'لا يوجد',
            ])->values()->all(),
            'totals' => [
                'deposits' => $depositsTotal,
                'withdrawals' => $withdrawalsTotal,
                'treasury_net' => $withdrawalsTotal,
                'net' => $depositsTotal - $withdrawalsTotal,
                'transactions_count' => $transactions->count(),
            ],
        ];
    }
}
