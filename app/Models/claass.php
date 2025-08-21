<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class claass extends Model
{
    protected $fillable = [
        'language',
        'phase',
        'edu_year',
        'class_number',
        'actual_capacity',
        'max_capacity',
    ];


}
