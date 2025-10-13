<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $grades = [
            1 => "الاول",
            2 => "الثاني",
            3 => "الثالث",
            4 => "الرابع",
            5 => "الخامس",
            6 => "السادس",
        ];


        return [
            'id' => $this->id,
            'type' => $this->type,
            'level' => $this->level,
            'grade' => $grades[$this->grade],
            'imported_quantity' => $this->imported_quantity,
            'available_quantity' => $this->available_quantity,
            'price' => $this->price,
            'bought_quantity' => $this->imported_quantity - $this->available_quantity
        ];
    }
}
