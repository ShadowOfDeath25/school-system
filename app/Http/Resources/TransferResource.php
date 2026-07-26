<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransferResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'student_id' => $this->student_id,
            'student_name' => $this->whenLoaded('student', fn () => $this->student->name_in_arabic),
            'student_reg_number' => $this->whenLoaded('student', fn () => $this->student->reg_number),
            'direction' => $this->direction,
            'other_school_name' => $this->other_school_name,
            'notes' => $this->notes,
            'transfer_date' => $this->transfer_date?->format('Y-m-d'),
            'academic_year' => $this->academic_year,
            'created_by' => $this->whenLoaded('creator', fn () => $this->creator?->name),
            'created_at' => $this->created_at,
        ];
    }
}
