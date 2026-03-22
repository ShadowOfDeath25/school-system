<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\LogsActivityInArabic;

class BookPurchase extends Model
{
    use LogsActivityInArabic;
    protected $fillable = [
        'quantity',
        'book_id',
        'student_id'
    ];


    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }
    public function student():BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

}
