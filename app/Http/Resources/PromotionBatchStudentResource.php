<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PromotionBatchStudentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'student_id' => $this->student_id,
            'student_name' => $this->student?->name_in_arabic,
            'student_grade' => $this->student?->grade,
            'from_grade' => $this->from_grade,
            'to_grade' => $this->to_grade,
            'from_classroom_id' => $this->from_classroom_id,
            'to_classroom_id' => $this->to_classroom_id,
            'decision' => $this->decision,
            'second_round_passed' => $this->second_round_passed,
            'rolled_back' => $this->rolled_back,
            'notes' => $this->notes,
        ];
    }
}
