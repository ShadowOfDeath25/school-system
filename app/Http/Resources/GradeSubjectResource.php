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
        $components = $this->pivot->components ?? [];
        $totalMarks = collect($components)->sum(fn ($component) => (float) ($component['marks'] ?? 0));
        $finalExamMarks = collect($components)
            ->where('is_final_exam', true)
            ->sum(fn ($component) => (float) ($component['marks'] ?? 0));

        return [
            'id' => $this->id,
            'grade_subject_id' => $this->pivot->id,
            'name' => $this->name,
            'subject_id' => $this->id,
            'language' => $this->pivot->language,
            'type' => $this->type,
            'min_marks' => $this->pivot->min_marks,
            'max_marks' => $totalMarks,
            'total_marks' => $totalMarks,
            'added_to_total' => $this->pivot->added_to_total,
            'added_to_report' => $this->pivot->added_to_report,
            'semester' => $this->pivot->semester,
            'components' => $components,
            'exam_marks' => $finalExamMarks,
            'final_exam_marks' => $finalExamMarks,
        ];
    }
}