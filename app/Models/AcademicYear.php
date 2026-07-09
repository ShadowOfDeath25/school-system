<?php

namespace App\Models;

use App\Observers\AcademicYearObserver;
use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\Cache;

#[ObservedBy([AcademicYearObserver::class])]
class AcademicYear extends Model
{
    use HasFactory, LogsActivityInArabic;

    protected $fillable = [
        'name',
        'active',
    ];

    public static function activeCached(): ?self
    {
        return Cache::rememberForever('academic_year.active',
            fn () => static::query()->active()->first()
        );
    }

    public function scopeActive(Builder|EloquentBuilder $q): Builder|EloquentBuilder
    {
        return $q->where('active', true);
    }
}
