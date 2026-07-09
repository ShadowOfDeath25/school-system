<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PromotionBatchResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'from_academic_year' => $this->from_academic_year,
            'to_academic_year' => $this->to_academic_year,
            'total_students' => $this->total_students,
            'promoted_count' => $this->promoted_count,
            'repeated_count' => $this->repeated_count,
            'graduated_count' => $this->graduated_count,
            'status' => $this->status,
            'created_by' => $this->creator?->name,
            'rolled_back_at' => $this->rolled_back_at,
            'rolled_back_by' => $this->rollbacker?->name,
            'created_at' => $this->created_at,
            'batch_students_count' => $this->whenCounted('batchStudents'),
            'batch_students' => PromotionBatchStudentResource::collection($this->whenLoaded('batchStudents')),
        ];
    }
}
