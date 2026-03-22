<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivityInArabic;

class Bus extends Model
{
    use LogsActivityInArabic;
    protected $fillable = [
        'route',
        'supervisor_name',
        'driver_name',
        'capacity',
        'license_plate',
        'number'
    ];
}
