<?php

namespace Database\Factories;

use App\Models\Classroom;
use App\Models\Guardian;
use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gender = $this->faker->randomElement(['male', 'female']);
        $language = $this->faker->randomElement(['عربي', 'لغات']);
        $academicYear = $this->faker->randomElement(['2024/2025', '2026/2026']);
        $classroom = Classroom::where('language', $language)->where('academic_year', $academicYear)->inRandomOrder()->first()?->id;
        return [
            'name_in_arabic' => fake('ar_EG')->name($gender),
            'name_in_english' => fake('en_EG')->name($gender),
            'nid' => $this->faker->unique()->numerify('##############'),
            'birth_date' => $this->faker->dateTimeBetween('-13 years', '-5 years'),
            'birth_address' => fake()->city(),
            'note' => $this->faker->optional(0.2)->randomElement([null, 'ابناء عاملين', 'دمج', 'يتيم']),
            'gender' => $gender,
            'religion' => $this->faker->randomElement(['مسلم', 'مسيحي']),
            'nationality' => $this->faker->randomElement(['مصري', 'اجنبي']),
            'reg_number' => fake()->numerify('#######'),
            'withdrawn' => fake()->randomElement([true, false]),
            'status' => fake()->randomElement(['مستجد', "باقي"]),
            'classroom_id' => fake()->randomElement([null, $classroom, $classroom, $classroom]),
            'language' => $language,
        ];
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure()
    {
        return $this->afterCreating(function (Student $student) {
            $numberOfGuardians = $this->faker->numberBetween(1, 2);

            if ($numberOfGuardians === 1) {

                $guardian = Guardian::factory()->create();
                $student->guardians()->attach($guardian->id);
            } else {

                $father = Guardian::factory()->state(['gender' => 'male'])->create();
                $mother = Guardian::factory()->state(['gender' => 'female'])->create();
                $student->guardians()->attach([$father->id, $mother->id]);
            }
        });
    }
}
