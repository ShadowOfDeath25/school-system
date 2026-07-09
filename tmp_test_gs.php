<?php
require __DIR__ . "/vendor/autoload.php";
$app = require __DIR__ . "/bootstrap/app.php";
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$gs = App\Models\GradeSubject::create([
    "grade_id" => 1,
    "subject_id" => 1,
    "min_marks" => 50,
    "max_marks" => 100,
    "language" => "عربي",
    "semester" => "الأول",
    "components" => [["id" => "final", "name" => "test", "marks" => 100, "is_final_exam" => true]],
]);
echo "OK: " . $gs->id . "\n";
