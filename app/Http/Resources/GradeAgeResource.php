<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GradeAgeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $minDisplay = $this->min_years . ' سنوات'
            . ($this->min_months ? " و {$this->min_months} أشهر" : '');

        $maxDisplay = $this->max_years
            ? $this->max_years . ' سنوات'
                . ($this->max_months ? " و {$this->max_months} أشهر" : '')
            : null;

        return [
            'id' => $this->id,
            'grade_id' => $this->grade_id,
            'grade_name' => $this->grade?->name,
            'grade' => $this->grade?->grade,
            'min_years' => $this->min_years,
            'min_months' => $this->min_months,
            'max_years' => $this->max_years,
            'max_months' => $this->max_months,
            'min_display' => $minDisplay,
            'max_display' => $maxDisplay,
        ];
    }
}
