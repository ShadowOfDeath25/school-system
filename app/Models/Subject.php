<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subject extends Model
{
    protected $fillable = [
        'name',
        'max_degree',
        'phase',
        'semester',
        'language',
        'academic_year',
        'added_to_total',
    ];

    public function books(): HasMany
    {
        return $this->hasMany(Book::class);
    }


}
