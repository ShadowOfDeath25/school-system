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
        $superAdmin = new User([
            "name"=>"Abdelrahman Rafeek",
            'email'=>"abdo.251152@gmail.com",
            'password'=>"12345aA!",
        ]);

        $superAdmin->assignRole("Super Admin");
        $superAdmin->save();
        User::factory(70)->create();

    }
}
