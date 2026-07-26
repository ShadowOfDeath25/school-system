<?php

namespace Database\Seeders;

use App\Models\Exemption;
use App\Models\NoteType;
use Illuminate\Database\Seeder;

class ExemptionSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            'دمج' => '1000',
            'ابناء عاملين' => '1000',
            'يتيم' => '1000',
            'توأم' => '1000',
        ];
        foreach ($items as $key => $value) {
            Exemption::firstOrCreate(
                ['type' => $key],
                ['value' => $value]
            );
        }

        $existingTypes = Exemption::pluck('type');
        NoteType::whereNotIn('name', $existingTypes)->each(function ($noteType) {
            Exemption::firstOrCreate(
                ['type' => $noteType->name],
                ['value' => 0]
            );
        });
    }
}
