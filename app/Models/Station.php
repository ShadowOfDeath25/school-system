<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Station extends Model
{
    protected $fillable = [
        'academic_year',
        'city',
        'neighborhood',
        'value',
    ];
}
