<?php

namespace App\Models;

use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Model;

class SubjectType extends Model
{
    use LogsActivityInArabic;

    protected $fillable = [
        'name',
    ];
}
