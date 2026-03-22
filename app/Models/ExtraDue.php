<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivityInArabic;

class ExtraDue extends Model
{
    use LogsActivityInArabic;
    protected $fillable = [
        'note',
        'student_id',
        'value',
        'academic_year'
    ];
}
