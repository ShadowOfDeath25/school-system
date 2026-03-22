<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivityInArabic;

class Uniform extends Model
{
    use LogsActivityInArabic;

    protected $fillable = [
        'type',
        'size',
        'academic_year',
        'imported_quantity',
        'available_quantity',
        'piece',
        'buy_price',
        'sell_price',
        'level'
    ];

}
