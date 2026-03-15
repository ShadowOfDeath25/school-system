<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class LettersExport implements FromView, ShouldAutoSize
{
    public function __construct(public array $viewData)
    {}

    public function view(): View
    {
        return view('reports.letters', $this->viewData);
    }
}
