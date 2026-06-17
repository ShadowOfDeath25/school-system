<?php

namespace App\Models;

use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Model;

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
