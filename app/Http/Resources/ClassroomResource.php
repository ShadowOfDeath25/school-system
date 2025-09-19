<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassroomResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'name' => "" . $this->grade . "/" . $this->class_number . " " . $this->level,
            'academic_year' => $this->academic_year,
            'max_capacity' => $this->max_capacity,
            'language' => $this->language,
            'capacity' => count($this->students ?? []) ?? 0,
            'occupancy' => (count($this->students ?? []) / $this->max_capacity * 100) . "%" ?? 0

        ];
    }
}
