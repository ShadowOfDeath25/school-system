<?php

namespace App\Models;

use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Guardian extends Model
{
    use HasFactory, LogsActivityInArabic;

    protected $table = 'parents';

    protected $fillable = [
        'name',
        'edu',
        'gender',
        'phone_number',
        'job',
        'nid',
        'relationship',
    ];

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'parent_student', 'parent_id', 'student_id');
    }
}
