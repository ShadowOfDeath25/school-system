<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class SeatNumber extends Model
{
    //
    protected $fillable = [
        'level',
        'grade',
        'starts_at',
        'ends_at',
    ];
}
