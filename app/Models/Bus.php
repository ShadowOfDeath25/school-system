<?php

namespace App\Models;

use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Model;

class Bus extends Model
{
    use LogsActivityInArabic;

    protected $fillable = [
        'route',
        'supervisor_name',
        'driver_name',
        'capacity',
        'license_plate',
        'number',
    ];
}
