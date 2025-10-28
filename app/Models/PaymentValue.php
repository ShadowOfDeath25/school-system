<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentValue extends Model
{
    use HasFactory;

    protected $fillable = [
        'academic_year',
        'language',
        'grade',
        'level',
        'value',
        'type'
    ];
}
