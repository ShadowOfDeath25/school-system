<?php

namespace App\Models;

use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Building extends Model
{
    use HasFactory;
    use LogsActivityInArabic;

    protected $fillable = [
        'name',
    ];

    public function floors(): HasMany
    {
        return $this->hasMany(Floor::class);
    }
}
