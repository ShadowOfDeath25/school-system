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
            'reg_number' => $this->reg_number,
            "name_in_arabic" => $this->name_in_arabic,
            "nid" => $this->nid,
            "father_name" => $father->name ?? "غير مسجل",
            "mother_name" => $mother->name ?? "غير مسجل",
            "father_edu" => $father->edu ?? "غير مسجل",
            "father_job" => $father->job ?? "غير مسجل",
            "father_phone_number" => $father->phone_number ?? "غير مسجل",
            "mother_edu" => $mother->edu ?? "غير مسجل",
            "mother_phone_number" => $mother->phone_number ?? "غير مسجل",
            "mother_job" => $mother->job ?? "غير مسجل",
            "classroom" => $classroom_name,
            'note' => $this->note,
            'status' => $this->status,
            'withdrawn' => $this->withdrawn ? 'نعم' : 'لا',
            "nationality" => $this->nationality,
            "name_in_english" => $this->name_in_english,
            "gender" => $this->gender,
            "religion" => $this->religion,
            "birth_date" => $this->birth_date,
            "birth_address" => $this->birth_address
        ];
    }
}
