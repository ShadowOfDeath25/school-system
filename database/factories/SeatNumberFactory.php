<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SeatNumber>
 */
class SeatNumberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $level = fake()->randomElement(["اعدادي", "ابتدائي", 'رياض اطفال']);
        $grades = [
            "رياض اطفال" => fake()->numberBetween(1, 2),
            "ابتدائي" => fake()->numberBetween(1, 6),
            "اعدادي" => fake()->numberBetween(1, 3)
        ];
        $starts_at = fake()->numberBetween(100000, 999900);
        return [
            'level' => $level,
            'grade' => $grades[$level],
            'academic_year' => fake()->randomElement(['2024/2025', '2025/2026']),
            'language' => fake()->randomElement(['لغات', 'عربي']),
            'starts_at' => $starts_at,
            'ends_at' => $starts_at + 100
        ];
    }
}
