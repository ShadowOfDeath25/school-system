<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivityInArabic;

class SubjectType extends Model
{
    use LogsActivityInArabic;
    protected $fillable = [
        'name'
    ];
}
