<?php

namespace Database\Factories;

use App\Models\AcademicYear;
use App\Models\Exam;
use App\Models\Marks;
use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Marks>
 */
class MarksFactory extends Factory
{
    protected $model = Marks::class;

    public function definition(): array
    {
        $exam = Exam::with('gradeSubject')->inRandomOrder()->first() ?? Exam::factory()->create();
        $components = $exam->gradeSubject?->components ?? [];
        $component = $this->faker->randomElement($components);

        return [
            'student_id' => Student::inRandomOrder()->first()?->id ?? Student::factory(),
            'exam_id' => $exam->id,
            'marks' => $this->faker->optional(0.8)->randomFloat(1, 0, (float) ($component['marks'] ?? 100)),
            'component_id' => $component['id'] ?? $exam->component_id,
            'academic_year' => AcademicYear::activeCached()?->name ?? $this->faker->randomElement(['2025/2026', '2026/2027']),
        ];
    }
}
