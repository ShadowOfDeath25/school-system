<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamHallResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'number' => $this->number,
            'capacity' => $this->capacity,
            'academic_year' => $this->academic_year,
            'classroom' => $this->whenLoaded('classroom', function () {
                return [
                    'id' => $this->classroom->id,
                    'name' => $this->classroom->name,
                    'language' => $this->classroom->language,
                    'level' => $this->classroom->level,
                    'grade' => $this->classroom->grade,
                    'max_capacity' => $this->classroom->max_capacity,
                ];
            }),
            'classroom_id' => $this->classroom_id,
            'created_at' => $this->created_at,
        ];
    }
}
