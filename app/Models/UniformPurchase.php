<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UniformPurchase extends Model
{
    protected $fillable = [
        'uniform_id',
        'student_id',
        'quantity',
    ];


    public function uniform(): BelongsTo
    {
        return $this->belongsTo(Uniform::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
