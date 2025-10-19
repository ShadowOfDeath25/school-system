<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Income extends Model
{
    protected $fillable = [
        'academic_year',
        'type',
        'value',
        'description',
        'date',
    ];

}
