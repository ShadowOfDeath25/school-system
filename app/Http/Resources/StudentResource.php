<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $classroom_name = "غير مقيد";
        if ($this->relationLoaded('classroom') && $this->classroom) {
            $classroom_name = "{$this->classroom->grade}/{$this->classroom->class_number} {$this->classroom->level}";
        }

        $father_name = null;
        $mother_name = null;
        if ($this->relationLoaded('guardians')) {
            $father_name = $this->guardians->get(0)?->name;
            $mother_name = $this->guardians->get(1)?->name;
        }

        return [
            "id" => $this->id,
            "name" => $this->name_in_arabic,
            "nid" => $this->nid,
            "father" => $father_name,
            'mother' => $mother_name,
            "classroom" => $classroom_name
        ];
    }
}
