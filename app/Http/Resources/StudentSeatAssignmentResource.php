<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentSeatAssignmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $gradeWords = [
            1 => 'الأول',
            2 => 'الثاني',
            3 => 'الثالث',
            4 => 'الرابع',
            5 => 'الخامس',
            6 => 'السادس',
        ];

        return [
            'id' => $this->id,
            'student_id' => $this->student_id,
            'student_name' => $this->whenLoaded('student', fn () => $this->student->name_in_arabic),
            'seat_number' => $this->assigned_number,
            'academic_year' => $this->academic_year,
            'level' => $this->whenLoaded('seatNumberConfig', fn () => $this->seatNumberConfig->level),
            'grade' => $this->whenLoaded('seatNumberConfig', fn () => $gradeWords[(int) $this->seatNumberConfig->grade] ?? $this->seatNumberConfig->grade),
            'language' => $this->whenLoaded('seatNumberConfig', fn () => $this->seatNumberConfig->language),
        ];
    }
}
