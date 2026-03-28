<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        Carbon::setLocale('ar');
        $this->load("gradeSubject.subject");
        return [
            'id' => $this->id,
            'name' => $this->name,
            'level' => $this->level,
            'formatted_date' => (new Carbon($this->date))->translatedFormat('h:i a - d/m/Y'),
            'subject' => $this->gradeSubject->subject->name,
            'academic_year' => $this->academic_year,
            'grade' => $this->grade,
            'type' => $this->type,
            'subject_type' => $this->gradeSubject->subject->type,
            'marks' => $this->marks,
            'duration_in_hours' => $this->duration_in_hours + 0,
            'semester' => $this->semester,
            'date' => $this->date

        ];
    }
}
