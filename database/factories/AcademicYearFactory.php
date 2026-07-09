<?php

namespace Database\Factories;

use App\Models\AcademicYear;
use Illuminate\Database\Eloquent\Factories\Factory;

class AcademicYearFactory extends Factory
{
    protected $model = AcademicYear::class;

    public function definition(): array
    {
        $start = fake()->numberBetween(2030, 2090);

        return [
            'name' => "{$start}/" . ($start + 1),
            'active' => false,
        ];
    }
}
