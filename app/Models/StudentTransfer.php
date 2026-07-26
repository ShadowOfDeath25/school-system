<?php

namespace App\Models;

use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentTransfer extends Model
{
    use LogsActivityInArabic;

    protected $fillable = [
        'student_id',
        'direction',
        'other_school_name',
        'notes',
        'transfer_date',
        'academic_year',
        'created_by',
    ];

    protected $casts = [
        'transfer_date' => 'date',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
