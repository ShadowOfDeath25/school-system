<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookPurchase extends Model
{
    protected $fillable = [
        'quantity',
        'book_id',
        'student_name'
    ];

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

}
