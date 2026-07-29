<?php

namespace App\Http\Resources;

use App\Enums\Grade;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentSeatAssignmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'student_id' => $this->student_id,
            'student_name' => $this->whenLoaded('student', fn () => $this->student->name_in_arabic),
            'seat_number' => $this->assigned_number,
            'academic_year' => $this->academic_year,
            'level' => $this->whenLoaded('seatNumberConfig', fn () => $this->seatNumberConfig->level),
            'grade' => $this->whenLoaded('seatNumberConfig', fn () => Grade::from((int) $this->seatNumberConfig->grade)->label()),
            'grade_value' => $this->whenLoaded('seatNumberConfig', fn () => (int) $this->seatNumberConfig->grade),
            'language' => $this->whenLoaded('seatNumberConfig', fn () => $this->seatNumberConfig->language),
        ];
    }
}
