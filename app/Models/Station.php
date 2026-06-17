<?php

namespace App\Models;

use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Model;

class Station extends Model
{
    use LogsActivityInArabic;

    protected $fillable = [
        'academic_year',
        'city',
        'neighborhood',
        'value',
    ];
}
