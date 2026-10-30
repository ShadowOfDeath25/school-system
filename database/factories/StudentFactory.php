<?php

namespace Database\Factories;

use App\Models\Classroom;
use App\Models\Guardian;
use App\Models\NoteType;
use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Student>
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
        $academicYear = $this->faker->randomElement(['2026/2025', '2025/2024']);
        $grade = $this->faker->numberBetween(1, 11);
        $level = getLevel($grade);
        $classroom = Classroom::where('language', $language)
            ->where('academic_year', $academicYear)
            ->where('grade', $grade)
            ->inRandomOrder()
            ->first()?->id;

        return [
            'name_in_arabic' => fake('ar_EG')->firstName($gender),
            'name_in_english' => fake('en_EG')->firstName($gender),
            'nid' => $this->faker->unique()->numerify('##############'),
            'birth_date' => $this->faker->dateTimeBetween('-13 years', '-5 years'),
            'birth_address' => fake()->city(),
            'note' => $this->faker->optional(0.2)->randomElement(
                NoteType::pluck('name')->push(null)->all()
            ),
            'level' => $level,
            'grade' => $grade,
            'gender' => $gender,
            'religion' => $this->faker->randomElement(['مسلم', 'مسيحي']),
            'nationality' => $this->faker->randomElement(['مصري', 'اجنبي']),
            'withdrawn' => fake()->randomElement([true, false]),
            'status' => fake()->randomElement(['مستجد', 'باقي']),
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

            $father = Guardian::factory()->state([
                'gender' => 'male',
                'name' => fake('ar_EG')->name('male'),
            ])->create();

            if ($numberOfGuardians === 1) {
                $student->parents()->attach($father->id);
            } else {
                $mother = Guardian::factory()->state([
                    'gender' => 'female',
                    'name' => fake('ar_EG')->name('female'),
                ])->create();
                $student->parents()->attach([$father->id, $mother->id]);
            }

            if (! $student->guardian_id) {
                $student->updateQuietly(['guardian_id' => $father->id]);
            }
        });
    }
}
