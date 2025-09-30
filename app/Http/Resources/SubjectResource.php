<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"=>$this->id,
            "name" => $this->name,
            "max_marks" => $this->max_marks,
            "min_marks" => $this->min_marks,
            "semester" => $this->semester,
            "language" => $this->language,
            "grade" => $this->grade,
            "level" => $this->level,
            'type' => $this->type,
            'academic_year' => $this->academic_year,
            'added_to_report' => $this->added_to_report,
            'added_to_total' => $this->added_to_total ? "نعم" : "لا"
        ];
    }
}
