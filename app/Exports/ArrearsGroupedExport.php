<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class ArrearsGroupedExport implements FromView, ShouldAutoSize
{
    public function __construct(public array $viewData)
    {}

    public function view(): View
    {
        return view('reports.arrears_grouped', $this->viewData);
    }
}
