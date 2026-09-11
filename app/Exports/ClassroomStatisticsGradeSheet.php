<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;

class ClassroomStatisticsGradeSheet implements FromView, ShouldAutoSize, WithEvents, WithTitle
{
    public function __construct(
        public array $gradeData,
        public ?string $sheetTitle = null,
    ) {}

    public function view(): View
    {
        return view('reports.excel.classroom_statistics', $this->gradeData);
    }

    public function title(): string
    {
        if ($this->sheetTitle) {
            return $this->sheetTitle;
        }

        return self::sanitizeSheetTitle($this->gradeData['grade_name'] ?? 'احصائيات الفصول');
    }

    public static function sanitizeSheetTitle(string $title): string
    {
        $cleaned = str_replace(['\\', '/', '?', '*', ':', '[', ']'], '', $title);
        $trimmed = trim($cleaned);
        return mb_substr($trimmed ?: 'احصائيات', 0, 31);
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $dimension = $sheet->calculateWorksheetDimension();

                $sheet->getStyle($dimension)
                    ->getAlignment()
                    ->setHorizontal(Alignment::HORIZONTAL_RIGHT);

                $sheet->setRightToLeft(true);

                $sheet->getStyle($dimension)
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