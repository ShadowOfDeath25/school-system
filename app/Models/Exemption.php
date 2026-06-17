<?php

namespace App\Models;

use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Model;

class Exemption extends Model
{
    use LogsActivityInArabic;

    protected $fillable = [
        'student_id',
        'type',
        'value',
    ];
}
