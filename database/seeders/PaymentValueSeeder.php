<?php

namespace Database\Seeders;

use App\Models\PaymentValue;
use Illuminate\Database\Seeder;

class PaymentValueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * This seeder populates the database with specific payment values for different
     * academic levels, grades, and types (tuition, books, etc.).
     */
    public function run(): void
    {
        PaymentValue::query()->truncate();


        $currentYear = now()->year;
        $academicYears = [
            ($currentYear - 1) . '/' . $currentYear,
            $currentYear . '/' . ($currentYear + 1),
        ];

        $gradeSpecificData = [
            'رياض اطفال' => [
                'grades' => ['الاول', "الثاني"],
                'values' => [
                    ['type' => 'المصروفات الدراسية', 'language' => 'عربي', 'value' => 3000],
                    ['type' => 'المصروفات الدراسية', 'language' => 'لغات', 'value' => 5000],
                    ['type' => 'المصروفات الادارية', 'language' => 'لغات', 'value' => 250],
                    ['type' => 'المصروفات الادارية', 'language' => 'عربي', 'value' => 250],

                ]
            ],
            'ابتدائي' => [
                'grades' => ["الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس"],
                'values' => [
                    ['type' => 'المصروفات الدراسية', 'language' => 'عربي', 'value' => 4000],
                    ['type' => 'المصروفات الدراسية', 'language' => 'لغات', 'value' => 6000],
                    ['type' => 'المصروفات الادارية', 'language' => 'لغات', 'value' => 250],
                    ['type' => 'المصروفات الادارية', 'language' => 'عربي', 'value' => 250],

                ]
            ],
            'اعدادي' => [
                'grades' => ["الأول", "الثاني", "الثالث"],
                'values' => [
                    ['type' => 'المصروفات الدراسية', 'language' => 'عربي', 'value' => 5000],
                    ['type' => 'المصروفات الدراسية', 'language' => 'لغات', 'value' => 7000],
                    ['type' => 'المصروفات الادارية', 'language' => 'لغات', 'value' => 250],
                    ['type' => 'المصروفات الادارية', 'language' => 'عربي', 'value' => 250],

                ]
            ]
        ];


        $generalFees = [
            ['type' => 'مصروفات السيارة', 'value' => 1500],
        ];
        foreach ($academicYears as $academicYear) {

            foreach ($gradeSpecificData as $level => $levelData) {
                foreach ($levelData['grades'] as $grade) {
                    foreach ($levelData['values'] as $payment) {
                        PaymentValue::create([
                            'academic_year' => $academicYear,
                            'level' => $level,
                            'grade' => $grade,
                            'type' => $payment['type'],
                            'language' => $payment['language'] ?? null,
                            'value' => $payment['value'],
                        ]);
                    }
                }
            }


            foreach ($generalFees as $fee) {
                PaymentValue::create([
                    'academic_year' => $academicYear,
                    'level' => null,
                    'grade' => null,
                    'type' => $fee['type'],
                    'language' => null,
                    'value' => $fee['value'],
                ]);
            }
        }
    }
}
