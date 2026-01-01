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

        $level = $this->faker->randomElement(['ابتدائي', 'اعدادي', 'رياض اطفال']);
        $grade = match ($level) {
            'رياض اطفال' => $this->faker->numberBetween(1, 2),
            'ابتدائي' => $this->faker->numberBetween(1, 6),
            'اعدادي' => $this->faker->numberBetween(1, 3),
        };
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
            'name' => $grade . '/' . $newClassNumber . ' ' .$level,
            'max_capacity'=>fake()->numberBetween(30,50),
            'floor_id' => Floor::query()->inRandomOrder()->value('id')
        ];
    }
}
