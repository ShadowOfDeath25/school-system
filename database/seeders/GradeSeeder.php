<?php

namespace Database\Seeders;

use App\Models\Grade;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GradeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $grades = [
            [
                "name" => "الاول رياض اطفال",
                "grade" => 1
            ],
            [
                "name" => "الثاني رياض اطفال",
                "grade" => 2
            ],
            [
                "name" => "الاول الابتدائي",
                "grade" => 3
            ],
            [
                "name" => "الثاني الابتدائي",
                "grade" => 4
            ],
            [
                "name" => "الثالث الابتدائي",
                "grade" => 5
            ],
            [
                "name" => "الرابع الابتدائي",
                "grade" => 6
            ],
            [
                "name" => "الخامس الابتدائي",
                "grade" => 7
            ],
            [
                "name" => "السادس الابتدائي",
                "grade" => 8
            ],
            [
                "name" => "الاول الاعدادي",
                "grade" => 9
            ],
            [
                "name" => "الثاني الاعدادي",
                "grade" => 10
            ],
            [
                "name" => "الثالث الاعدادي",
                "grade" => 11
            ]
        ];
        Grade::insert($grades);
    }
}
