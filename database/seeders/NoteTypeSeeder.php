<?php

namespace Database\Seeders;

use App\Models\NoteType;
use Illuminate\Database\Seeder;

class NoteTypeSeeder extends Seeder
{
    public function run(): void
    {
        $items = ['ابناء عاملين', 'توأم', 'دمج', 'يتيم'];

        foreach ($items as $name) {
            NoteType::firstOrCreate(['name' => $name]);
        }
    }
}
