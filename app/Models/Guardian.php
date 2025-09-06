<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guardian extends Model
{
    protected $fillable = [
        'name',
        'edu',
        'gender',
        'phone_number',
        'job',

    ];


}
