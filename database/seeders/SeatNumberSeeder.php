<?php

namespace Database\Seeders;

use App\Models\SeatNumber;
use Illuminate\Database\Seeder;

class SeatNumberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SeatNumber::factory(50)->create();
    }
}
