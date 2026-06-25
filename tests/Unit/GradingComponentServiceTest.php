<?php

use App\Services\GradingComponentService;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

uses(TestCase::class);

it('normalizes valid grading components and calculates the total marks', function () {
    $service = new GradingComponentService;

    $components = $service->validate([
        ['id' => 'coursework', 'name' => 'Coursework', 'marks' => 20, 'is_final_exam' => false],
        ['id' => 'final_exam', 'name' => 'Final Exam', 'marks' => 60, 'is_final_exam' => true],
    ]);

    expect($components)->toHaveCount(2)
        ->and($service->totalMarks($components))->toBe(80.0);
});

it('requires at least one final exam component', function () {
    $service = new GradingComponentService;

    $service->validate([
        ['id' => 'coursework', 'name' => 'Coursework', 'marks' => 20, 'is_final_exam' => false],
    ]);
})->throws(ValidationException::class);

it('rejects components without positive marks', function () {
    $service = new GradingComponentService;

    $service->validate([
        ['id' => 'final_exam', 'name' => 'Final Exam', 'marks' => 0, 'is_final_exam' => true],
    ]);
})->throws(ValidationException::class);