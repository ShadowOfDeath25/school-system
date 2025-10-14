<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UniformResource extends JsonResource
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
            'size' => $this->size,
            'imported_quantity' => $this->imported_quantity,
            'buy_price' => $this->buy_price,
            'sell_price' => $this->sell_price,
            'total_price' => $this->buy_price * $this->imported_quantity
        ];
    }
}
