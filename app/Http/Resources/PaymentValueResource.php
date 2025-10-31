<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentValueResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        return [
            'id' => $this->id,
            'type' => $this->type,
            'language' => $this->language,
            'level' => $this->level,
            'grade' => $this->grade,
            'academic_year' => $this->academic_year,
            'value' => $this->value,
        ];
    }
}
