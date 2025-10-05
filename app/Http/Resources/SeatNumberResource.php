<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SeatNumberResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $gradeWords = [
            1 => 'الأول',
            2 => 'الثاني',
            3 => 'الثالث',
            4 => 'الرابع',
            5 => 'الخامس',
            6 => 'السادس'
        ];
        return [
            'id' => $this->id,
            'level' => $this->level,
            'grade' => $gradeWords[$this->grade],
            'academic_year'=>$this->academic_year,
            'starts_at' => $this->starts_at,
            'ends_at' => $this->ends_at,
        ];
    }
}
