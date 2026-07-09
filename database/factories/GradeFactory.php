<?php

namespace Database\Factories;

use App\Models\Grade;
use Illuminate\Database\Eloquent\Factories\Factory;

class GradeFactory extends Factory
{
    protected $model = Grade::class;

    public function definition(): array
    {
        $grade = fake()->unique()->numberBetween(1, 11);

        return [
            'name' => "الصف " . $grade,
            'grade' => $grade,
        ];
    }
}
