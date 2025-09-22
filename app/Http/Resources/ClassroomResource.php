<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassroomResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $studentCount = $this->whenCounted('students', $this->students_count, fn() => $this->students()->count());

        $occupancy = "0%";
        if ($this->max_capacity > 0) {
            $occupancy = round(($studentCount / $this->max_capacity) * 100) . "%";
        }
        return [
            'id' => $this->id,
            'name' => "{$this->grade}/{$this->class_number} {$this->level}",
            'academic_year' => $this->academic_year,
            'max_capacity' => $this->max_capacity,
            'language' => $this->language,
            'capacity' => $studentCount,
            'occupancy' => $occupancy,
            'students' => $this->whenLoaded('students', function () {
                return $this->students->map(fn($student) => [
                    'name' => $student->name_in_arabic,
                ]);
            }),
        ];
    }
}
