<?php

namespace App\Models;

use App\Observers\AcademicYearObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy([AcademicYearObserver::class])]
class AcademicYear extends Model
{
    protected $fillable = ['name'];

    public static function latestYear(): AcademicYear
    {
        return AcademicYear::orderBy('name','desc')->first();
    }

}
