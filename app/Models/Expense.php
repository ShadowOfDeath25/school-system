<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class Expense extends Model
{
    protected $fillable = [
        'description',
        'value',
        'expense_date',
        'academic_year',
    ];
}
