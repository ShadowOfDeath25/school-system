<?php

use App\Models\Classroom;
use App\Models\Student;
use App\Services\Promotion\ClassroomAllocatorService;
use Tests\TestCase;

uses(TestCase::class);

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
    Classroom::factory()->create([
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
        'classroom_id' => 1,
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
