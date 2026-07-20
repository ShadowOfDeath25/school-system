<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class StudentMarksExport implements FromView, ShouldAutoSize, WithEvents
{
    public function __construct(public array $viewData) {}

    public function view(): View
    {
        return view('reports.excel.student_marks', $this->viewData);
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $sheet->getStyle($sheet->calculateWorksheetDimension())
                    ->getAlignment()
                    ->setHorizontal(Alignment::HORIZONTAL_RIGHT);
                $sheet->getParent()->getActiveSheet()->setRightToLeft(true);
            },
        ];
    }
}
