<?php

namespace App\Http\Requests\Student\Reports;

use App\Traits\Requests\HasReportFilters;
use Illuminate\Foundation\Http\FormRequest;

class GenerateDemographicsReportRequest extends FormRequest
{
    use HasReportFilters;

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return $this->baseReportFilters();
    }
}
