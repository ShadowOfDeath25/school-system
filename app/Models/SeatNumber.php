<?php

namespace App\Models;

use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SeatNumber extends Model
{
    use HasFactory, LogsActivityInArabic;

    protected $fillable = [
        'level',
        'grade',
        'language',
        'academic_year',
        'starts_at',
        'ends_at',
    ];

    public function assignments(): HasMany
    {
        return $this->hasMany(StudentSeatAssignment::class, 'seat_number_id');
    }
}
