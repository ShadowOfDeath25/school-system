<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ParentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->name,
            'student' => $this->student->name_in_arabic,
            'phone_number' => $this->phone_number,
            'edu' => $this->edu,
            'job' => $this->job,
            'gender' => $this->gender,
            'nid' => $this->nid,
        ];
    }
}
