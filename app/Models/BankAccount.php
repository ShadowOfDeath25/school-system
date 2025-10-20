<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BankAccount extends Model
{

    protected $fillable = [
        'notes',
        'type',
        'manager_name',
        'academic_year',
        'value',
        'date',
    ];
}
