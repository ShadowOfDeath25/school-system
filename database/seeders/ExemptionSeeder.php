<?php

namespace Database\Seeders;

use App\Models\Exemption;
use Illuminate\Database\Seeder;

class ExemptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            "دمج" => '1000',
            "ابناء عاملين" => '1000',
            "يتيم" => '1000',
        ];
        foreach ($items as $key => $value) {
            Exemption::create([
                'type' => $key,
                'value' => $value
            ]);
        }
    }
}
