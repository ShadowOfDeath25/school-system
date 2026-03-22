<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivityInArabic;

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
