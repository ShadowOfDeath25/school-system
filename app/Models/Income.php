<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivityInArabic;

class Income extends Model
{
    use LogsActivityInArabic;
    protected $fillable = [
        'academic_year',
        'type',
        'value',
        'description',
        'date',
    ];

}
