<?php

namespace App\Models;

use App\Traits\LogsActivityInArabic;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PromotionBatch extends Model
{
    use LogsActivityInArabic;

    protected $fillable = [
        'from_academic_year',
        'to_academic_year',
        'total_students',
        'promoted_count',
        'repeated_count',
        'graduated_count',
        'status',
        'created_by',
        'rolled_back_at',
        'rolled_back_by',
    ];

    protected $casts = [
        'rolled_back_at' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function rollbacker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'rolled_back_by');
    }

    public function batchStudents(): HasMany
    {
        return $this->hasMany(PromotionBatchStudent::class, 'promotion_batch_id');
    }

    public function scopePending(Builder $q): Builder
    {
        return $q->where('status', 'pending');
    }

    public function scopeCompleted(Builder $q): Builder
    {
        return $q->where('status', 'completed');
    }

    public function scopeRolledBack(Builder $q): Builder
    {
        return $q->where('status', 'rolled_back');
    }
}
