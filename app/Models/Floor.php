<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class Floor extends Model
{
    protected $fillable = [
        'name',
        'building_id',
    ];
}
