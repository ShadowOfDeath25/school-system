<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UniformPurchase extends Model
{
    protected $fillable = [
        'uniform_id',
        'student_name',
        'quantity',
    ];


    public function uniform(): BelongsTo
    {
        return $this->belongsTo(Uniform::class);
    }
}
