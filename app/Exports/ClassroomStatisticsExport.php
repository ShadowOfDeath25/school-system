<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class ClassroomStatisticsExport implements WithMultipleSheets
{
    public function __construct(
        public array $viewData,
    ) {}

    public function sheets(): array
    {
        $sheets = [];

        if (isset($this->viewData['grades'])) {
            $reportMeta = [
                'academic_year' => $this->viewData['academic_year'] ?? '',
                'language' => $this->viewData['language'] ?? '',
                'semester' => $this->viewData['semester'] ?? '',
            ];

            $sheetTitles = [];
            foreach ($this->viewData['grades'] as $gradeData) {
                $baseTitle = ClassroomStatisticsGradeSheet::sanitizeSheetTitle($gradeData['grade_name'] ?? 'صفحة');
                $title = $baseTitle;
                $counter = 2;
                while (isset($sheetTitles[$title])) {
                    $suffix = " ($counter)";
                    $title = mb_substr($baseTitle, 0, 31 - mb_strlen($suffix)) . $suffix;
                    $counter++;
                }
                $sheetTitles[$title] = true;

                $sheets[] = new ClassroomStatisticsGradeSheet(
                    array_merge($reportMeta, $gradeData),
                    $title
                );
            }
        } else {
            $title = ClassroomStatisticsGradeSheet::sanitizeSheetTitle($this->viewData['grade_name'] ?? 'احصائيات الفصول');
            $sheets[] = new ClassroomStatisticsGradeSheet($this->viewData, $title);
        }

        if (empty($sheets)) {
            $sheets[] = new ClassroomStatisticsGradeSheet([
                'academic_year' => $this->viewData['academic_year'] ?? '',
                'language' => $this->viewData['language'] ?? '',
                'semester' => $this->viewData['semester'] ?? '',
                'grade_name' => 'احصائيات الفصول',
                'subjects' => [],
                'classrooms' => [],
            ]);
        }

        return $sheets;
    }
}