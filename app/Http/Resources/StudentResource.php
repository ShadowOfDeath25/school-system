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
        return [
            "name" => $this->name_in_arabic,
            "nid" => $this->nid,
            "father" => $this->guardians[0]->name,
            'mother' => $this->guardians[1]->name,
            "classroom"=>$this->classroom ?? "غير مقيد",

        ];
    }
}
