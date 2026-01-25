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
        $superAdmin = new User(config('app.admin_data'));

        $superAdmin->save();
        $superAdmin->assignRole("Super Admin");
        User::factory(70)->create();

    }
}
