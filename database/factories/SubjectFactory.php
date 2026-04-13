<?php

namespace Database\Factories;

use App\Models\Subject;
use App\Models\SubjectType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Subject>
 */
class SubjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $name = $this->faker->unique()->word();
        return [
            "name" => $name,
            'language' => $this->faker->randomElement(['عربي', 'لغات']),
            'type' => SubjectType::inRandomOrder()->first()->name,
        ];
    }
}
