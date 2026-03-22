<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivityInArabic;

class Exemption extends Model
{
    use LogsActivityInArabic;
    protected $fillable = [
        'student_id',
        'type',
        'value',
    ];
}
