<?php

namespace App\Models;

use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use LogsActivityInArabic;

    protected $fillable = [
        'description',
        'value',
        'type',
        'academic_year',
        'date',
    ];
}
