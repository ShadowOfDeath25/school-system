<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = [
        'academic_year',
        'imported_quantity',
        'available_quantity',
        'semester',
        'price',
        'level',
        'subject',
        'year',
    ];
}
