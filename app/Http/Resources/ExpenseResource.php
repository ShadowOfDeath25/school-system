<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        Carbon::setLocale('ar');
        return [
            'id' => $this->id,
            'date' => $this->date,
            'formatted_date' => (new Carbon($this->date))->translatedFormat('d/m/Y'),
            'value' => $this->value,
            'type' => $this->type,
            'number' => $this->id,
            'description' => $this->description
        ];
    }
}
