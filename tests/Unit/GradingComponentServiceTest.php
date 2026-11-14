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

it('normalizes monthly exam components and calculates total marks with median', function () {
    $service = new GradingComponentService;

    $components = $service->validate([
        ['id' => 'october', 'name' => 'شهري اكتوبر', 'marks' => 10, 'is_final_exam' => false, 'is_monthly_exam' => true],
        ['id' => 'november', 'name' => 'شهري نوفمبر', 'marks' => 10, 'is_final_exam' => false, 'is_monthly_exam' => true],
        ['id' => 'final_exam', 'name' => 'Final Exam', 'marks' => 80, 'is_final_exam' => true],
    ]);

    expect($components)->toHaveCount(3)
        ->and($components[0]['is_monthly_exam'])->toBeTrue()
        ->and($components[1]['is_monthly_exam'])->toBeTrue()
        ->and($components[2]['is_monthly_exam'])->toBeFalse()
        // Without median: 10 + 10 + 80 = 100
        ->and($service->totalMarks($components, false))->toBe(100.0)
        // With median: (10 + 10) / 2 + 80 = 90
        ->and($service->totalMarks($components, true))->toBe(90.0);
});

it('rejects min_marks higher than median total marks', function () {
    $service = new GradingComponentService;

    $service->validate([
        ['id' => 'october', 'name' => 'شهري اكتوبر', 'marks' => 10, 'is_final_exam' => false, 'is_monthly_exam' => true],
        ['id' => 'november', 'name' => 'شهري نوفمبر', 'marks' => 10, 'is_final_exam' => false, 'is_monthly_exam' => true],
        ['id' => 'final_exam', 'name' => 'Final Exam', 'marks' => 80, 'is_final_exam' => true],
    ], minMarks: 95, useMonthlyMedian: true);
})->throws(ValidationException::class);

it('calculates student subject total correctly on GradeSubject model with median', function () {
    $gradeSubject = new \App\Models\GradeSubject([
        'use_monthly_median' => true,
        'components' => [
            ['id' => 'october', 'name' => 'شهري اكتوبر', 'marks' => 10, 'is_final_exam' => false, 'is_monthly_exam' => true],
            ['id' => 'november', 'name' => 'شهري نوفمبر', 'marks' => 10, 'is_final_exam' => false, 'is_monthly_exam' => true],
            ['id' => 'final_exam', 'name' => 'Final Exam', 'marks' => 80, 'is_final_exam' => true],
        ],
    ]);

    // Total max marks: (10 + 10)/2 + 80 = 90
    expect($gradeSubject->total_marks)->toBe(90.0);

    // Student scored: Oct = 8, Nov = 6, Final = 60
    // Monthly avg = (8 + 6) / 2 = 7, Total = 60 + 7 = 67
    $studentMarks = collect([
        'october' => 8,
        'november' => 6,
        'final_exam' => 60,
    ]);

    expect($gradeSubject->calculateStudentSubjectTotal($studentMarks))->toBe(67.0);

    // Without median:
    $gradeSubject->use_monthly_median = false;
    expect($gradeSubject->total_marks)->toBe(100.0)
        ->and($gradeSubject->calculateStudentSubjectTotal($studentMarks))->toBe(74.0);
});

it('handles year-long subjects with 4 monthly exams and median correctly', function () {
    $service = new GradingComponentService;

    $components = [
        ['id' => 'monthly_october_first_semester', 'name' => 'شهري اكتوبر', 'marks' => 10, 'is_final_exam' => false, 'is_monthly_exam' => true],
        ['id' => 'monthly_november_first_semester', 'name' => 'شهري نوفمبر', 'marks' => 10, 'is_final_exam' => false, 'is_monthly_exam' => true],
        ['id' => 'final_first_semester', 'name' => 'Final S1', 'marks' => 40, 'is_final_exam' => true],
        ['id' => 'monthly_march_second_semester', 'name' => 'شهري مارس', 'marks' => 10, 'is_final_exam' => false, 'is_monthly_exam' => true],
        ['id' => 'monthly_april_second_semester', 'name' => 'شهري ابريل', 'marks' => 10, 'is_final_exam' => false, 'is_monthly_exam' => true],
        ['id' => 'final_second_semester', 'name' => 'Final S2', 'marks' => 40, 'is_final_exam' => true],
    ];

    expect($service->totalMarks($components, false, 'طوال العام'))->toBe(120.0)
        ->and($service->totalMarks($components, true, 'طوال العام'))->toBe(100.0);

    $gradeSubject = new \App\Models\GradeSubject([
        'semester' => 'طوال العام',
        'use_monthly_median' => true,
        'components' => $components,
    ]);

    expect($gradeSubject->total_marks)->toBe(100.0);

    $s1Marks = collect([
        'monthly_october_first_semester' => 8,
        'monthly_november_first_semester' => 6,
        'final_first_semester' => 35,
    ]);
    expect($gradeSubject->calculateStudentSubjectTotal($s1Marks))->toBe(42.0);

    $allMarks = collect([
        'monthly_october_first_semester' => 8,
        'monthly_november_first_semester' => 6,
        'final_first_semester' => 35,
        'monthly_march_second_semester' => 10,
        'monthly_april_second_semester' => 8,
        'final_second_semester' => 36,
    ]);
    expect($gradeSubject->calculateStudentSubjectTotal($allMarks))->toBe(87.0);
});

it('correctly matches semester component IDs without false positives', function () {
    // S1 valid IDs
    expect(GradingComponentService::isSemester1ComponentId('monthly_october_first_semester'))->toBeTrue()
        ->and(GradingComponentService::isSemester1ComponentId('monthly_s1_1'))->toBeTrue()
        ->and(GradingComponentService::isSemester1ComponentId('exam_s1_test'))->toBeTrue()
        ->and(GradingComponentService::isSemester1ComponentId('october_exam'))->toBeTrue()
        ->and(GradingComponentService::isSemester1ComponentId('november_exam'))->toBeTrue();

    // S2 valid IDs
    expect(GradingComponentService::isSemester2ComponentId('monthly_march_second_semester'))->toBeTrue()
        ->and(GradingComponentService::isSemester2ComponentId('monthly_s2_1'))->toBeTrue()
        ->and(GradingComponentService::isSemester2ComponentId('exam_s2_test'))->toBeTrue()
        ->and(GradingComponentService::isSemester2ComponentId('march_exam'))->toBeTrue()
        ->and(GradingComponentService::isSemester2ComponentId('april_exam'))->toBeTrue();

    // Non-matching words containing s1 or s2 (e.g. class1, pass1, session2)
    expect(GradingComponentService::isSemester1ComponentId('class1'))->toBeFalse()
        ->and(GradingComponentService::isSemester1ComponentId('pass1'))->toBeFalse()
        ->and(GradingComponentService::isSemester1ComponentId('session1'))->toBeFalse()
        ->and(GradingComponentService::isSemester2ComponentId('class2'))->toBeFalse()
        ->and(GradingComponentService::isSemester2ComponentId('pass2'))->toBeFalse()
        ->and(GradingComponentService::isSemester2ComponentId('session2'))->toBeFalse();
});
