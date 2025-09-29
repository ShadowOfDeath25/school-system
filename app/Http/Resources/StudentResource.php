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

        $father = null;
        $mother = null;
        if ($this->relationLoaded('guardians')) {
            $father = $this->guardians->get(0);
            $mother = $this->guardians->get(1);
        }

        return [
            "id" => $this->id,
            "name_in_arabic" => $this->name_in_arabic,
            "nid" => $this->nid,
            "father_name" => $father->name,
            "mother_name" => $mother->name,
            "father_edu" => $father->edu,
            "father_job" => $father->job,
            "father_phone_number" => $father->phone_number,
            "mother_edu" => $mother->edu,
            "mother_phone_number" => $mother->phone_number,
            "mother_job" => $mother->job,
            "classroom" => $classroom_name,
            'note' => $this->note,
            "nationality" => $this->nationality,
            "name_in_english" => $this->name_in_english,
            "gender" => $this->gender,
            "religion" => $this->religion,
            "birth_date" => $this->birth_date,
            "birth_address" => $this->birth_address
        ];
    }
}
