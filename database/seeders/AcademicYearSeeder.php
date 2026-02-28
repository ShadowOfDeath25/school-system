<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AcademicYearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AcademicYear::firstOrCreate(['name' => '2025/2024', 'active' => false]);
        AcademicYear::firstOrCreate(['name' => '2026/2025', 'active' => true]);
    }
}
