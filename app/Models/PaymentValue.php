<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentValue extends Model
{
    use HasFactory;

    protected $fillable = [
        'academic_year',
        'language',
        'grade',
        'level',
        'value',
        'type'
    ];

    /**
     * Clones the payment values from the most recent academic year to the newly created one.
     *
     * @param string $newAcademicYear The name of the newly created academic year (e.g., "2027/2026")
     */
    public static function AddNewAcademicYear(string $newAcademicYear): void
    {

        $lastYearWithPayments = self::where('academic_year', '!=', $newAcademicYear)
            ->orderBy('academic_year', 'desc')
            ->first();

        if (!$lastYearWithPayments) {
            return;
        }

        $previousYear = $lastYearWithPayments->academic_year;

        $previousYearPayments = self::where('academic_year', $previousYear)->get();


        foreach ($previousYearPayments as $payment) {
            self::create([
                'academic_year' => $newAcademicYear,
                'language'      => $payment->language,
                'level'         => $payment->level,
                'value'         => $payment->value,
                'type'          => $payment->type,
            ]);
        }
    }
}
