<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bus extends Model
{
    protected $fillable = [
        'route',
        'supervisor_name',
        'driver_name',
        'capacity',
        'license_plate',
        'number'
    ];
}
