<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'name_in_arabic',
        'name_in_english',
        'nid',
        'birth_date',
        'birth_address',
        'language',
        'gender',
        'religion',
        'nationality',
        'class_id'
    ];
}
