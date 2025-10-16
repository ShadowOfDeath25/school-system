<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Uniform extends Model
{

    protected $fillable = [
        'type',
        'size',
        'academic_year',
        'imported_quantity',
        'available_quantity',
        'piece',
        'buy_price',
        'sell_price',
    ];

}
