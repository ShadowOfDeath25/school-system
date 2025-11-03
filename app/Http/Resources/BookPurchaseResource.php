<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookPurchaseResource extends JsonResource
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
            "id" => $this->id,
            "type" => $this->book->type,
            "level" => $this->book->level,
            "grade" => $grades[$this->book->grade],
            "quantity" => $this->quantity,
            'price' => $this->book->price,
            "total_price" => $this->quantity * $this->book->price,
            "student_name" => $this->student->name,
            "student" => $this->student
        ];
    }
}
