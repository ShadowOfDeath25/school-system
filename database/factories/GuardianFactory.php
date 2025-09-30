<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Guardian>
 */
class GuardianFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake('ar_EG')->name(),
            'phone_number' => '01' . $this->faker->randomElement(['0', '1', '2', '5']) . $this->faker->numerify('########'),
            'job' => fake('ar_EG')->jobTitle(),
            'edu' => fake()->randomElement(['High School', 'Bachelor', 'Master']),
            'gender' => fake()->randomElement(['male', 'female']),
        ];
    }
}
