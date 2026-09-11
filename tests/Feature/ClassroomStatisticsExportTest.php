<?php

namespace Tests\Feature;

use App\Exports\ClassroomStatisticsExport;
use App\Exports\ClassroomStatisticsGradeSheet;
use Maatwebsite\Excel\Facades\Excel;
use Tests\TestCase;

class ClassroomStatisticsExportTest extends TestCase
{
    public function test_multi_grade_creates_separate_sheets_with_titles(): void
    {
        $mockData = [
            'academic_year' => '2026/2025',
            'language' => 'عربي',
            'semester' => 'الأول',
            'grades' => [
                [
                    'grade_name' => 'الاول الابتدائي',
                    'subjects' => [
                        ['id' => 1, 'name' => 'اللغة العربية', 'max' => 50, 'min_marks' => 25],
                        ['id' => 2, 'name' => 'الرياضيات', 'max' => 50, 'min_marks' => 25],
                    ],
                    'classrooms' => [
                        [
                            'id' => 1,
                            'name' => '1/1 ابتدائي',
                            'total_students' => 20,
                            'subject_stats' => [
                                ['subject_id' => 1, 'attempted' => 20, 'succeeded' => 18, 'percentage' => 90.0],
                                ['subject_id' => 2, 'attempted' => 20, 'succeeded' => 15, 'percentage' => 75.0],
                            ],
                        ],
                    ],
                    'totals_row' => [
                        'name' => 'الجملة',
                        'total_students' => 20,
                        'subject_stats' => [
                            ['subject_id' => 1, 'attempted' => 20, 'succeeded' => 18, 'percentage' => 90.0],
                            ['subject_id' => 2, 'attempted' => 20, 'succeeded' => 15, 'percentage' => 75.0],
                        ],
                    ],
                ],
                [
                    'grade_name' => 'الثالث الابتدائي',
                    'subjects' => [
                        ['id' => 3, 'name' => 'اللغة العربية', 'max' => 50, 'min_marks' => 25],
                    ],
                    'classrooms' => [
                        [
                            'id' => 2,
                            'name' => '3/1 ابتدائي',
                            'total_students' => 15,
                            'subject_stats' => [
                                ['subject_id' => 3, 'attempted' => 15, 'succeeded' => 15, 'percentage' => 100.0],
                            ],
                        ],
                    ],
                    'totals_row' => [
                        'name' => 'الجملة',
                        'total_students' => 15,
                        'subject_stats' => [
                            ['subject_id' => 3, 'attempted' => 15, 'succeeded' => 15, 'percentage' => 100.0],
                        ],
                    ],
                ],
            ],
        ];

        $export = new ClassroomStatisticsExport($mockData);
        $sheets = $export->sheets();

        $this->assertCount(2, $sheets);
        $this->assertInstanceOf(ClassroomStatisticsGradeSheet::class, $sheets[0]);
        $this->assertInstanceOf(ClassroomStatisticsGradeSheet::class, $sheets[1]);
        $this->assertEquals('الاول الابتدائي', $sheets[0]->title());
        $this->assertEquals('الثالث الابتدائي', $sheets[1]->title());

        // Verify view renders
        $html0 = $sheets[0]->view()->render();
        $this->assertStringContainsString('الاول الابتدائي', $html0);
        $this->assertStringContainsString('احصائيات الفصول', $html0);
        $this->assertStringContainsString('1/1 ابتدائي', $html0);

        $html1 = $sheets[1]->view()->render();
        $this->assertStringContainsString('الثالث الابتدائي', $html1);
        $this->assertStringContainsString('3/1 ابتدائي', $html1);

        // Verify full Excel file generation succeeds
        $raw = Excel::raw($export, \Maatwebsite\Excel\Excel::XLSX);
        $this->assertNotEmpty($raw);
    }

    public function test_single_grade_creates_single_sheet(): void
    {
        $mockData = [
            'academic_year' => '2026/2025',
            'language' => 'عربي',
            'semester' => 'الأول',
            'grade_name' => 'الاول الاعدادي',
            'subjects' => [
                ['id' => 1, 'name' => 'العلوم', 'max' => 60, 'min_marks' => 30],
            ],
            'classrooms' => [],
        ];

        $export = new ClassroomStatisticsExport($mockData);
        $sheets = $export->sheets();

        $this->assertCount(1, $sheets);
        $this->assertEquals('الاول الاعدادي', $sheets[0]->title());

        $html = $sheets[0]->view()->render();
        $this->assertStringContainsString('الاول الاعدادي', $html);
        $this->assertStringContainsString('لا توجد بيانات', $html);

        $raw = Excel::raw($export, \Maatwebsite\Excel\Excel::XLSX);
        $this->assertNotEmpty($raw);
    }
}