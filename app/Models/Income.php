<?php

namespace App\Models;

use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Model;

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
