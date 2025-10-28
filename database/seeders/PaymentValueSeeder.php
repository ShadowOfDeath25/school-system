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
        PaymentValue::query()->truncate(); // Clear the table first


        $currentYear = now()->year;
        $academicYears = [
            ($currentYear - 1) . '/' . $currentYear,
            $currentYear . '/' . ($currentYear + 1),
        ];

        $gradeSpecificData = [
            'رياض اطفال' => [
                'grades' => [1, 2],
                'values' => [
                    ['type' => 'tuition', 'language' => 'عربي', 'value' => 3000],
                    ['type' => 'tuition', 'language' => 'لغات', 'value' => 5000],
                    ['type' => 'administrative', 'language' => 'لغات', 'value' => 250],
                    ['type' => 'administrative', 'language' => 'عربي', 'value' => 250],

                ]
            ],
            'ابتدائي' => [
                'grades' => [1, 2, 3, 4, 5, 6],
                'values' => [
                    ['type' => 'tuition', 'language' => 'عربي', 'value' => 4000],
                    ['type' => 'tuition', 'language' => 'لغات', 'value' => 6000],
                    ['type' => 'administrative', 'language' => 'لغات', 'value' => 250],
                    ['type' => 'administrative', 'language' => 'عربي', 'value' => 250],

                ]
            ],
            'اعدادي' => [
                'grades' => [1, 2, 3],
                'values' => [
                    ['type' => 'tuition', 'language' => 'عربي', 'value' => 5000],
                    ['type' => 'tuition', 'language' => 'لغات', 'value' => 7000],
                    ['type' => 'administrative', 'language' => 'لغات', 'value' => 250],
                    ['type' => 'administrative', 'language' => 'عربي', 'value' => 250],

                ]
            ]
        ];


        $generalFees = [
            ['type' => 'bus_fees', 'value' => 1500],
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
