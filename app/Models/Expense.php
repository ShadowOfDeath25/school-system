<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;
use App\Traits\LogsActivityInArabic;

class Expense extends Model
{
    use LogsActivityInArabic;
    protected $fillable = [
        'description',
        'value',
        'type',
        'academic_year',
        'date'
    ];
}
