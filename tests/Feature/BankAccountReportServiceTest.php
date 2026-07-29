<?php

use App\Models\AcademicYear;
use App\Models\BankAccount;
use App\Services\BankAccountReportService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('lists bank transactions and calculates deposit withdrawal and net totals', function () {
    AcademicYear::query()->create(['name' => '2025/2026', 'active' => true]);
    AcademicYear::query()->create(['name' => '2024/2025', 'active' => false]);

    BankAccount::query()->create([
        'academic_year' => '2025/2026',
        'type' => 'ايداع',
        'value' => 1250,
        'manager_name' => 'أحمد',
        'date' => '2025-10-01',
        'notes' => 'إيداع أول',
    ]);
    BankAccount::query()->create([
        'academic_year' => '2025/2026',
        'type' => 'سحب',
        'value' => 300,
        'manager_name' => 'أحمد',
        'date' => '2025-10-02',
        'notes' => 'سحب',
    ]);
    BankAccount::query()->create([
        'academic_year' => '2025/2026',
        'type' => 'إيداع',
        'value' => 50,
        'manager_name' => 'منى',
        'date' => '2025-10-03',
        'notes' => 'إيداع ثان',
    ]);
    BankAccount::query()->create([
        'academic_year' => '2024/2025',
        'type' => 'ايداع',
        'value' => 9999,
        'manager_name' => 'خارج التقرير',
        'date' => '2025-10-01',
        'notes' => 'عام آخر',
    ]);

    $report = app(BankAccountReportService::class)->getReportData('2025/2026');

    expect($report['transactions'])->toHaveCount(3)
        ->and($report['totals'])->toMatchArray([
            'deposits' => 1300.0,
            'withdrawals' => 300.0,
            'treasury_net' => 300.0,
            'net' => 1000.0,
            'transactions_count' => 3,
        ])
        ->and($report['transactions'][0]['deposit'])->toBe(1250.0)
        ->and($report['transactions'][1]['withdrawal'])->toBe(300.0);
});

it('limits bank transactions to the requested date range', function () {
    AcademicYear::query()->create(['name' => '2025/2026', 'active' => true]);

    foreach ([
        ['2025-09-01', 100],
        ['2025-10-15', 200],
        ['2025-11-01', 300],
    ] as [$date, $value]) {
        BankAccount::query()->create([
            'academic_year' => '2025/2026',
            'type' => 'ايداع',
            'value' => $value,
            'manager_name' => 'المسؤول',
            'date' => $date,
            'notes' => 'حركة',
        ]);
    }

    $report = app(BankAccountReportService::class)
        ->getReportData('2025/2026', '2025-10-01', '2025-10-31');

    expect($report['transactions'])->toHaveCount(1)
        ->and($report['totals']['deposits'])->toBe(200.0)
        ->and($report['totals']['net'])->toBe(200.0);
});
