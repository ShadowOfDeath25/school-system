<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superAdmin = new User(config('admin_data'));

        $superAdmin->assignRole("Super Admin");
        $superAdmin->save();
        User::factory(70)->create();

    }
}
