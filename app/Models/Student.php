<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
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
        "note",
        'gender',
        'religion',
        'nationality',
        'classroom_id'
    ];

    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function guardians(): BelongsToMany
    {
        return $this->belongsToMany(Guardian::class);
    }
}
