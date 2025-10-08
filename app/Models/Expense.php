<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class Expense extends Model
{
    protected $fillable = [
        'description',
        'value',
        'type',
        'academic_year',
        'date'
    ];
}
