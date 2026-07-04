<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MarksResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $component = optional($this->exam->gradeSubject)->component($this->component_id);

        return [
            'id' => $this->id,
            'student_id' => $this->student_id,
            'exam_id' => $this->exam_id,
            'marks' => $this->marks ? (float) $this->marks : null,
            'component_id' => $this->component_id,
            'academic_year' => $this->academic_year,
            'student' => $this->whenLoaded('student', fn () => [
                'id' => $this->student->id,
                'name_in_arabic' => $this->student->name_in_arabic,
                'reg_number' => $this->student->reg_number,
            ]),
            'exam' => $this->whenLoaded('exam', fn () => [
                'id' => $this->exam->id,
                'name' => $this->exam->name,
                'semester' => $this->exam->semester,
                'type' => $this->exam->type,
            ]),
            'component_name' => $component['name'] ?? null,
            'component_max_marks' => $component['marks'] ?? null,
            'created_at' => $this->created_at,
        ];
    }
}
