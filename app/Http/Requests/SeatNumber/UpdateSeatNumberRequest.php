<?php

namespace App\Http\Requests\SeatNumber;

use App\Models\SeatNumber;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSeatNumberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'level' => ['string', 'max:255', 'in:ابتدائي,رياض أطفال,اعدادي'],
            'grade' => ['integer'],
            'academic_year' => ['exists:academic_years,name'],
            'language' => ['string', 'max:255', 'in:عربي,لغات'],
            'starts_at' => ['numeric'],
            'ends_at' => ['numeric'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $record = SeatNumber::find((int) $this->route('seat_number'));

            if (! $record) {
                return;
            }

            $level = $this->level ?? $record->level;
            $grade = $this->grade ?? $record->grade;
            $language = $this->language ?? $record->language;
            $academicYear = $this->academic_year ?? $record->academic_year;
            $startsAt = $this->starts_at ?? $record->starts_at;
            $endsAt = $this->ends_at ?? $record->ends_at;

            $overlap = SeatNumber::where('level', $level)
                ->where('grade', (string) $grade)
                ->where('language', $language)
                ->where('academic_year', $academicYear)
                ->where('id', '!=', $record->id)
                ->where('starts_at', '<=', (int) $endsAt)
                ->where('ends_at', '>=', (int) $startsAt)
                ->exists();

            if ($overlap) {
                $validator->errors()->add('starts_at', 'نطاق أرقام الجلوس هذا يتداخل مع نطاق موجود مسبقاً لنفس المجموعة');
            }
        });
    }
}
