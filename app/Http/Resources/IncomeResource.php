<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IncomeResource extends JsonResource
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
            'doc_no' => $this->id,
            'value' => $this->value,
            'formatted_date' => (new Carbon($this->date))->format('d/m/Y'),
            'type' => $this->type,
            'description' => $this->description
        ];
    }
}
