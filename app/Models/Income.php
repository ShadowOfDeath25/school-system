<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class income extends Model
{
    protected $fillable = [
        'type',
        'value',
    ];

}
