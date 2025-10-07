<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SecretNumberResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'grade' => $this->grade,
            'group_capacity' => $this->group_capacity,
            'group_number' => $this->group_number,
            'academic_year' => $this->academic_year,
            'language' => $this->language,
            'level' => $this->level,
            'starts_at' => $this->starts_at,
            'ends_at' => $this->ends_at,
            'semester' => $this->semester
        ];
    }
}
