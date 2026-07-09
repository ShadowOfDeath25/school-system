<?php

namespace Database\Factories;

use App\Models\Exam;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExamFactory extends Factory
{
    protected $model = Exam::class;

    public function definition(): array
    {
        return [
            'grade_subject_id' => 1,
            'component_id' => 'final',
            'academic_year' => '2025/2026',
            'name' => 'الامتحان النهائي',
            'marks' => 100,
            'language' => 'عربي',
            'semester' => 'الأول',
        ];
    }
}
