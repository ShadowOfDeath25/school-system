<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\LogsActivityInArabic;

class Building extends Model
{
    use LogsActivityInArabic;
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function floors(): HasMany
    {
        return $this->hasMany(Floor::class);
    }
}
