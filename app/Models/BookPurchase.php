<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookPurchase extends Model
{
    protected $fillable= [

        'quantity',
        'book_id',
        'student_name'
    ];
}
