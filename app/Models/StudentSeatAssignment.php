<?php

namespace App\Models;

use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentSeatAssignment extends Model
{
    use LogsActivityInArabic;

    protected $fillable = [
        'student_id',
        'seat_number_id',
        'assigned_number',
        'academic_year',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function seatNumberConfig(): BelongsTo
    {
        return $this->belongsTo(SeatNumber::class, 'seat_number_id');
    }
}
