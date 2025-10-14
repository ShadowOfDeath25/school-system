<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UniformPurchaseResource extends JsonResource
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
            'type' => $this->uniform->type,
            'quantity' => $this->quantity,
            'price' => $this->uniform->sell_price,
            'total_price' => $this->uniform->sell_price * $this->quantity,
            'student_name' => $this->student_name
        ];
    }
}
