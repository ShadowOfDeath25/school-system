<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class PermissionFactory extends Factory
{


    public static function generate(): void
    {
        $modelPath = app_path('Models');
        $actions = ['view', 'create', 'update', 'delete'];

        foreach (File::files($modelPath) as $file) {
            $className = pathinfo($file->getFilename(), PATHINFO_FILENAME);
            $fqcn = "App\\Models\\{$className}";

            if (!class_exists($fqcn)) {
                continue;
            }


            $resource = Str::plural(Str::kebab($className));

            foreach ($actions as $action) {

                Permission::findOrCreate("$action $resource");
            }
        }
    }

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [

        ];
    }
}

