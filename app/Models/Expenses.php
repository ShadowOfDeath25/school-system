<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class Expenses extends Model
{
    protected $fillable = [
        'description',
        'value',
        'expense_date',
        'academic_year',
    ];
}
