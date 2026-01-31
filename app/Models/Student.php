<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    use HasFactory;

    protected static function booted(): void
    {
        static::creating(function (Student $student) {
            if ($student->reg_number) {
                return;
            }

            $date = Carbon::parse($student->birth_date);
            $prefix = $date->format('y') . $date->format('m');

            $latest = Student::where('reg_number', 'like', $prefix . '%')
                ->orderBy('reg_number', 'desc')
                ->first();

            if (!$latest) {
                $sequence = 1;
            } else {
                $sequence = intval(substr($latest->reg_number, 4)) + 1;
            }

            $student->reg_number = $prefix . str_pad($sequence, 3, '0', STR_PAD_LEFT);
        });


    }

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
        'classroom_id',
        'withdrawn',
        'reg_number',
        'status',
        'language',
    ];

    public function classroom(): BelongsTo
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

    public function bookPurchases(): hasMany
    {
        return $this->hasMany(BookPurchase::class);
    }

    public function uniformPurchases(): hasMany
    {
        return $this->hasMany(UniformPurchase::class);
    }

    protected function hasSiblings(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->relationLoaded('guardians')) {
                    return false;
                }
                $guardianIds = $this->guardians->pluck('id');
                if ($guardianIds->isEmpty()) {
                    return false;
                }

                return GuardianStudent::whereIn('guardian_id', $guardianIds)
                    ->where('student_id', '!=', $this->id)
                    ->exists();
            }
        );
    }

}
