<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subject extends Model
{
    protected $fillable = [
        'name',
        'type',
        'language',
    ];


    public function books(): HasMany
    {
        return $this->hasMany(Book::class);
    }

    public function exams(): HasMany
    {
        return $this->hasMany(Exam::class);
    }


}
