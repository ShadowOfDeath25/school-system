<?php

namespace App\Traits;

use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

trait LogsActivityInArabic
{
    use LogsActivity;

    /**
     * Set up default options for activity logging in Arabic.
     *
     * @return LogOptions
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            // Log all fillable attributes
            ->logFillable()
            // Only log changes actually made
            ->logOnlyDirty()
            // Do not store empty logs if no attributes were changed
            ->dontSubmitEmptyLogs()
            // Customize the description string using our localization
            ->setDescriptionForEvent(function (string $eventName) {
                // If the translations don't exist, we fallback to event name
                $modelName = class_basename($this);
                // "تم التعديل", "تمت الإضافة", etc.
                return trans("activitylog.events.{$eventName}", ['model' => $modelName]);
            });
    }
}
