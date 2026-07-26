<?php

namespace App\Models;

use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Relations\Pivot;

class GuardianStudent extends Pivot
{
    use LogsActivityInArabic;

    protected $table = 'parent_student';
}
