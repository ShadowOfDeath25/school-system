<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use App\Traits\LogsActivityInArabic;

class GuardianStudent extends Pivot
{
    use LogsActivityInArabic;

}
