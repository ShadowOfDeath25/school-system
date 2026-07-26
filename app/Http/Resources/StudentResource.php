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
        $classroom_name = 'غير مقيد';
        if ($this->relationLoaded('classroom') && $this->classroom) {
            $classroom_name = "{$this->classroom->grade}/{$this->classroom->class_number} {$this->classroom->level}";
        }

        $father = null;
        $mother = null;
        if ($this->relationLoaded('parents')) {
            $father = $this->parents->get(0);
            $mother = $this->parents->get(1);
        }

        return [
            'id' => $this->id,
            'language' => $this->language,
            'reg_number' => $this->reg_number,
            'name_in_arabic' => $this->name_in_arabic,
            'academic_year' => $this->classroom->academic_year ?? 'غير مقيد',
            'nid' => $this->nid,
            'father_name' => $father->name ?? 'غير مسجل',
            'mother_name' => $mother->name ?? 'غير مسجل',
            'father_edu' => $father->edu ?? 'غير مسجل',
            'father_job' => $father->job ?? 'غير مسجل',
            'father_phone_number' => $father->phone_number ?? 'غير مسجل',
            'mother_edu' => $mother->edu ?? 'غير مسجل',
            'mother_phone_number' => $mother->phone_number ?? 'غير مسجل',
            'mother_job' => $mother->job ?? 'غير مسجل',
            'note' => $this->note ?? 'لا يوجد',
            'status' => $this->status,
            'withdrawn' => $this->withdrawn ? 'نعم' : 'لا',
            'nationality' => $this->nationality,
            'name_in_english' => $this->name_in_english,
            'gender' => $this->gender,
            'religion' => $this->religion,
            'birth_date' => $this->birth_date,
            'birth_address' => $this->birth_address,
            'joined_at' => $this->created_at->format('Y/m/d'),
            'grade' => $this->grade,
            'level' => $this->level,
            'classroom' => $this->classroom ??
                [
                    'name' => 'غير مقيد',
                    'grade' => 'غير مقيد',
                    'level' => 'غير مقيد',
                ],
            'has_siblings' => $this->has_siblings ? 'نعم' : 'لا',
            'guardian_id' => $this->guardian_id,
            'guardian_type' => $this->when($this->relationLoaded('guardian') && $this->guardian, function () {
                if ($this->guardian->relationship) {
                    return 'other';
                }
                if ($this->relationLoaded('parents')) {
                    foreach ($this->parents as $i => $parent) {
                        if ($parent->id === $this->guardian->id) {
                            return $i === 0 ? 'father' : 'mother';
                        }
                    }
                }
                return 'other';
            }, 'father'),
            'guardian_relationship' => $this->guardian?->relationship,
            'guardian_name' => $this->guardian?->name,
            'guardian_nid' => $this->guardian?->nid,
            'guardian_phone_number' => $this->guardian?->phone_number,
        ];
    }
}
