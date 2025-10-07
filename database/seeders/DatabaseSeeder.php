<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Database\Factories\SeatNumberFactory;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            PermissionSeeder::class,
            BuildingSeeder::class,
            FloorSeeder::class,
            ClassroomSeeder::class,
            StudentSeeder::class,
            SeatNumberSeeder::class,
            SecretNumberSeeder::class
        ]);

    }
}
