<?php

namespace App\Http\Resources;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransferResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $isModel = $this->resource instanceof Model;

        $studentName = $this->student_name;
        if ($isModel && $this->relationLoaded('student')) {
            $studentName = $this->student?->full_name ?? $this->student?->name_in_arabic;
        }

        $studentRegNumber = $this->student_reg_number;
        if ($isModel && $this->relationLoaded('student')) {
            $studentRegNumber = $this->student?->reg_number;
        }

        $createdBy = $this->created_by;
        if ($isModel && $this->relationLoaded('creator')) {
            $createdBy = $this->creator?->name;
        }

        $transferDate = $this->transfer_date;
        if ($transferDate instanceof \DateTimeInterface) {
            $transferDate = $transferDate->format('Y-m-d');
        } elseif (is_string($transferDate)) {
            $transferDate = substr($transferDate, 0, 10);
        }

        return [
            'id' => $this->id,
            'student_id' => $this->student_id,
            'student_name' => $studentName,
            'student_reg_number' => $studentRegNumber,
            'direction' => $this->direction,
            'other_school_name' => $this->other_school_name,
            'notes' => $this->notes,
            'transfer_date' => $transferDate,
            'academic_year' => $this->academic_year,
            'created_by' => $createdBy,
            'created_at' => $this->created_at,
        ];
    }
}
