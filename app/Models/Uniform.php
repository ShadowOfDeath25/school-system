<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Uniform extends Model
{

    protected $fillable = [
        'type',
        'size',
        'imported_quantity',
        'available_quantity',
        'price',
    ];

}
