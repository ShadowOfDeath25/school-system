<?php

namespace App\Models;

use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Model;

class ExpenseType extends Model
{
    use LogsActivityInArabic;

    protected $fillable = [
        'name',
    ];
}
