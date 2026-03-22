<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Traits\LogsActivityInArabic;

class Guardian extends Model
{
    use HasFactory, LogsActivityInArabic;

    protected $fillable = [
        'name',
        'edu',
        'gender',
        'phone_number',
        'job',
        'nid',
    ];

    public function students(): belongsToMany
    {
        return $this->belongsToMany(Student::class);
    }


}
