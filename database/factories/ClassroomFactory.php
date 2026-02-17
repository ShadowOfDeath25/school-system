<?php

namespace Database\Factories;

use App\Models\Classroom;
use App\Models\Floor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Classroom>
 */
class ClassroomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gradesMap = [
            'رياض اطفال' => [1, 2],
            'ابتدائي' => [3, 4, 5, 6, 7, 8],
            'اعدادي' => [9, 10, 11],
        ];

        $existingGrades = Classroom::pluck('grade')->unique()->toArray();

        $missingGrades = [];
        foreach ($gradesMap as $lvl => $grds) {
            foreach ($grds as $g) {
                if (!in_array($g, $existingGrades)) {
                    $missingGrades[$g] = $lvl;
                }
            }
        }

        if (!empty($missingGrades)) {
            $grade = array_rand($missingGrades);
            $level = $missingGrades[$grade];
        } else {
            $level = $this->faker->randomElement(['ابتدائي', 'اعدادي', 'رياض اطفال']);
            $grade = match ($level) {
                'رياض اطفال' => $this->faker->numberBetween(1, 2),
                'ابتدائي' => $this->faker->numberBetween(3, 8),
                'اعدادي' => $this->faker->numberBetween(9, 11),
            };
        }

        $academic_year = $this->faker->randomElement(['2025/2024', '2026/2025']);
        $language = $this->faker->randomElement(['عربي', 'لغات']);

        $existingClassNumbers = Classroom::where("grade", $grade)
            ->where('level', $level)
            ->where('academic_year', $academic_year)
            ->where('language', $language)
            ->pluck('class_number')
            ->sort()
            ->all();

        $newClassNumber = 1;
        foreach ($existingClassNumbers as $number) {
            if ($number != $newClassNumber) break;
            $newClassNumber++;
        }

        return [
            'level' => $level,
            'grade' => $grade,
            'academic_year' => $academic_year,
            'language' => $language,
            'class_number' => $newClassNumber,
            'name' => $newClassNumber . '/' . getGradeNumber($grade) . ' ' . $level,
            'max_capacity' => fake()->numberBetween(30, 50),
            'floor_id' => Floor::query()->inRandomOrder()->value('id')
        ];
    }
}
