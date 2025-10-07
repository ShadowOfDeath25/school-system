<?php

namespace Database\Seeders;

use App\Models\SecretNumber;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SecretNumberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SecretNumber::factory(50)->create();
    }
}
