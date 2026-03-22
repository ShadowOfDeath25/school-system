<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivityInArabic;

class BankAccount extends Model
{
    use LogsActivityInArabic;

    protected $fillable = [
        'notes',
        'type',
        'manager_name',
        'academic_year',
        'value',
        'date',
    ];
}
