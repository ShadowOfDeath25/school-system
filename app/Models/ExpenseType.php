<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivityInArabic;

class ExpenseType extends Model
{
    use LogsActivityInArabic;
    protected $fillable=[
        'name'
    ];
}
