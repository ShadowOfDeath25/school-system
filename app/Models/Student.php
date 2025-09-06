<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    protected $fillable = [
        'name_in_arabic',
        'name_in_english',
        'nid',
        'birth_date',
        'birth_address',
        'language',
        'gender',
        'religion',
        'nationality',
        'classroom_id'
    ];

    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }
    public function payments():HasMany
    {
        return $this->hasMany(Payment::class);
    }
    public function parents():BelongsToMany
    {
        return $this->belongsToMany(Parent::class);
    }
}
