<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentParentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->name,
            'student' => $this->student->name_in_arabic,
            'phone_number' => $this->phone_number,
            'edu' => $this->education,
            'job' => $this->job,
            'gender' => $this->gender
        ];
    }
}
