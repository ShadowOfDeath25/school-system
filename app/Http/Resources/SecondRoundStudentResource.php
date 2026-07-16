<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SecondRoundStudentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $academicYear = $this->batch->from_academic_year;
        $secretAssignment = $this->student?->secretAssignments
            ->firstWhere('academic_year', $academicYear);

        return [
            'id' => $this->student_id,
            'assigned_number' => $secretAssignment?->assigned_number,
            'from_academic_year' => $this->batch->from_academic_year,
            'to_academic_year' => $this->batch->to_academic_year,
        ];
    }
}
