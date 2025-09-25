<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class Building extends Model
{
    protected $fillable = [
        'name',
    ];
}
