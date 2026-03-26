<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GradeSubjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "language" => $this->pivot->language,
            "type" => $this->type,
            "min_marks" => $this->pivot->min_marks,
            "max_marks" => $this->pivot->max_marks,
            "added_to_total" => $this->pivot->added_to_total,
            "added_to_report" => $this->pivot->added_to_report,
            "semester" => $this->pivot->semester,
            "classwork_marks" => $this->pivot->classwork_marks,
            "exam_marks" => $this->pivot->exam_marks
        ];
    }
}
