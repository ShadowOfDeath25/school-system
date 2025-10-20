<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BankAccountResource extends JsonResource
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
            'type' => $this->type,
            'value' => $this->value,
            'formatted_date' => (new Carbon($this->date))->format('d/m/Y'),
            'manager_name' => $this->manager_name,
            'notes' => $this->notes ?? "لا يوجد"
        ];
    }
}
