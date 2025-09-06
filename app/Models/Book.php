<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'year',
    ];

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class,'subject_id',"id");
    }


}
