<?php

namespace App\Http\Requests\SeatNumber;

use App\Models\SeatNumber;
use Illuminate\Foundation\Http\FormRequest;

class StoreSeatNumberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'level' => ['required', 'string', 'max:255', 'in:ابتدائي,رياض أطفال,اعدادي'],
            'grade' => ['required', 'integer', 'max:255'],
            'academic_year' => ['required', 'exists:academic_years,name'],
            'language' => ['required', 'string', 'max:255', 'in:عربي,لغات'],
            'starts_at' => [
                'required',
                'numeric',
                function ($attribute, $value, $fail) {
                    $overlap = SeatNumber::where('level', $this->level)
                        ->where('grade', (string) $this->grade)
                        ->where('language', $this->language)
                        ->where('academic_year', $this->academic_year)
                        ->where('starts_at', '<=', (int) $this->ends_at)
                        ->where('ends_at', '>=', (int) $value)
                        ->exists();

                    if ($overlap) {
                        $fail('نطاق أرقام الجلوس هذا يتداخل مع نطاق موجود مسبقاً لنفس المجموعة');
                    }
                },
            ],
            'ends_at' => ['required', 'numeric'],
        ];
    }
}
