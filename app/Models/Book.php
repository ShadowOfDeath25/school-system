<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    protected $fillable = [
        'academic_year',
        'imported_quantity',
        'available_quantity',
        'semester',
        'price',
        'level',
        'subject_id',
        'grade',
        'type',
        'language',
        'buy_price',
    ];

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class, 'subject_id', "id");
    }

    public function purchases(): HasMany
    {
        return $this->hasMany(BookPurchase::class, 'book_id', 'id');
    }

}
