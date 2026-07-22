<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;

class ArrearsGroupedExport implements FromView, ShouldAutoSize, WithEvents
{
    public function __construct(public array $viewData) {}

    public function view(): View
    {
        return view('reports.excel.arrears_grouped', $this->viewData);
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

                $sheet->getStyle($sheet->calculateWorksheetDimension())
                    ->applyFromArray([
                        'borders' => [
                            'allBorders' => [
                                'borderStyle' => Border::BORDER_THIN,
                                'color' => ['argb' => 'FF000000'],
                            ],
                            'outline' => [
                                'borderStyle' => Border::BORDER_MEDIUM,
                                'color' => ['argb' => 'FF000000'],
                            ],
                        ],
                    ]);
            },
        ];
    }
}
