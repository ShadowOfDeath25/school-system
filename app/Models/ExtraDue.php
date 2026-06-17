<?php

namespace App\Models;

use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Model;

class ExtraDue extends Model
{
    use LogsActivityInArabic;

    protected $fillable = [
        'note',
        'student_id',
        'value',
        'academic_year',
    ];
}
