<?php

use App\Models\Classroom;
use App\Models\Student;
use App\Services\Promotion\ClassroomAllocatorService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    $this->service = new ClassroomAllocatorService;
});

it('allocates to existing classroom with remaining capacity', function () {
    $classroom = Classroom::factory()->create([
        'grade' => 5,
        'language' => 'عربي',
        'level' => 'ابتدائي',
        'class_number' => 1,
        'max_capacity' => 30,
        'academic_year' => '2026-2027',
    ]);

    $student = Student::factory()->create([
        'grade' => 4,
        'language' => 'عربي',
        'level' => 'ابتدائي',
    ]);

    $result = $this->service->allocate($student, 5, '2026-2027');

    expect($result->id)->toBe($classroom->id);
});

it('creates new classroom when all existing ones are full', function () {
    $classroom = Classroom::factory()->create([
        'grade' => 5,
        'language' => 'عربي',
        'level' => 'ابتدائي',
        'class_number' => 1,
        'max_capacity' => 1,
        'academic_year' => '2026-2027',
    ]);

    // Fill the classroom
    Student::factory()->create([
        'grade' => 5,
        'language' => 'عربي',
        'level' => 'ابتدائي',
        'classroom_id' => $classroom->id,
        'withdrawn' => false,
    ]);

    $student = Student::factory()->create([
        'grade' => 4,
        'language' => 'عربي',
        'level' => 'ابتدائي',
    ]);

    $result = $this->service->allocate($student, 5, '2026-2027');

    expect($result->class_number)->toBe(2);
});

it('creates first classroom when none exist', function () {
    $student = Student::factory()->create([
        'grade' => 4,
        'language' => 'عربي',
        'level' => 'ابتدائي',
    ]);

    $result = $this->service->allocate($student, 5, '2026-2027');

    expect($result->class_number)->toBe(1);
    expect($result->grade)->toBe(5);
    expect($result->language)->toBe('عربي');
    expect($result->level)->toBe('ابتدائي');
});

it('matches language correctly', function () {
    $classroom = Classroom::factory()->create([
        'grade' => 5,
        'language' => 'لغات',
        'level' => 'ابتدائي',
        'class_number' => 1,
        'max_capacity' => 30,
        'academic_year' => '2026-2027',
    ]);

    $student = Student::factory()->create([
        'grade' => 4,
        'language' => 'عربي',
        'level' => 'ابتدائي',
    ]);

    $result = $this->service->allocate($student, 5, '2026-2027');

    expect($result->id)->not->toBe($classroom->id);
    expect($result->language)->toBe('عربي');
});
it('assigns boys and girls to different classrooms during batch allocation', function () {
    Classroom::factory()->create([
        'grade' => 5,
        'language' => 'عربي',
        'level' => 'ابتدائي',
        'class_number' => 1,
        'max_capacity' => 30,
        'academic_year' => '2027-2028',
    ]);

    $boy = Student::factory()->create([
        'grade' => 4,
        'language' => 'عربي',
        'level' => 'ابتدائي',
        'gender' => 'male',
    ]);
    $girl = Student::factory()->create([
        'grade' => 4,
        'language' => 'عربي',
        'level' => 'ابتدائي',
        'gender' => 'female',
    ]);

    $allocations = $this->service->allocateBatch(
        collect([$boy, $girl]),
        5,
        '2027-2028',
        ['group_by_gender' => true],
    );

    expect($allocations[$boy->id]->id)->not->toBe($allocations[$girl->id]->id);
});

it('keeps top students separate from regular students during batch allocation', function () {
    Classroom::factory()->create([
        'grade' => 5,
        'language' => 'عربي',
        'level' => 'ابتدائي',
        'class_number' => 1,
        'max_capacity' => 30,
        'academic_year' => '2028-2029',
    ]);

    $students = Student::factory()->count(3)->create([
        'grade' => 4,
        'language' => 'عربي',
        'level' => 'ابتدائي',
        'gender' => 'male',
    ]);
    $scores = collect([
        $students[0]->id => 100,
        $students[1]->id => 80,
        $students[2]->id => 60,
    ]);

    $allocations = $this->service->allocateBatch(
        $students,
        5,
        '2028-2029',
        ['top_student_count' => 1],
        $scores,
    );

    expect($allocations[$students[0]->id]->id)
        ->not->toBe($allocations[$students[1]->id]->id)
        ->and($allocations[$students[1]->id]->id)
        ->toBe($allocations[$students[2]->id]->id);
});
