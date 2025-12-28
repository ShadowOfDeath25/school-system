<?php

namespace Database\Seeders;

use App\Models\PaymentValue;
use Illuminate\Database\Seeder;

class PaymentValueSeeder extends Seeder
{

    public function run(): void
    {
        PaymentValue::query()->truncate();


        $currentYear = now()->year;
        $academicYears = [
            ($currentYear - 1) . '/' . $currentYear,
            $currentYear . '/' . ($currentYear + 1),
        ];

        $levelSpecificData = [
            'رياض اطفال' => [
                ['type' => 'مصروفات دراسية', 'language' => 'عربي', 'value' => 3000],
                ['type' => 'مصروفات دراسية', 'language' => 'لغات', 'value' => 5000],
                ['type' => 'مصروفات ادارية', 'language' => 'لغات', 'value' => 250],
                ['type' => 'مصروفات ادارية', 'language' => 'عربي', 'value' => 250],
            ],
            'ابتدائي' => [
                ['type' => 'مصروفات دراسية', 'language' => 'عربي', 'value' => 4000],
                ['type' => 'مصروفات دراسية', 'language' => 'لغات', 'value' => 6000],
                ['type' => 'مصروفات ادارية', 'language' => 'لغات', 'value' => 250],
                ['type' => 'مصروفات ادارية', 'language' => 'عربي', 'value' => 250],
            ],
            'اعدادي' => [
                ['type' => 'مصروفات دراسية', 'language' => 'عربي', 'value' => 5000],
                ['type' => 'مصروفات دراسية', 'language' => 'لغات', 'value' => 7000],
                ['type' => 'مصروفات ادارية', 'language' => 'لغات', 'value' => 250],
                ['type' => 'مصروفات ادارية', 'language' => 'عربي', 'value' => 250],
            ]
        ];

        foreach ($academicYears as $academicYear) {
            foreach ($levelSpecificData as $level => $payments) {
                foreach ($payments as $payment) {
                    PaymentValue::create([
                        'academic_year' => $academicYear,
                        'level' => $level,
                        'type' => $payment['type'],
                        'language' => $payment['language'] ?? null,
                        'value' => $payment['value'],
                    ]);
                }
            }
        }
        PaymentValue::create([
            'type' => 'مصروفات سحب الملف',
            'value' => 200
        ]);
    }
}
