<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class BankAccount extends Model
{
    //
    protected $fillable = [
        'document_number',
        'notes',
        'type',
        'manager_name',
        'academic_year',
        'value',
        'date',
    ];
}
