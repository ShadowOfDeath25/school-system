<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class DailyPaymentsExport implements FromView, ShouldAutoSize
{
    public function __construct(public array $viewData)
    {}

    public function view(): View
    {
        return view('reports.daily_payments', $this->viewData);
    }
}
