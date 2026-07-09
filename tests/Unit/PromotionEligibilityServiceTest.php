<?php

use App\Models\AcademicYear;
use App\Models\Exam;
use App\Models\Grade;
use App\Models\GradeSubject;
use App\Models\Marks;
use App\Models\Student;
use App\Models\Subject;
use App\Services\Promotion\PromotionEligibilityService;
use Tests\TestCase;

uses(TestCase::class);

beforeEach(function () {
    $this->service = new PromotionEligibilityService;
    $this->year = AcademicYear::factory()->create(['name' => '2025-2026', 'active' => true]);
    $this->grade11 = Grade::factory()->create(['grade' => 11, 'name' => 'الثالث الاعدادي']);
    $this->subject = Subject::factory()->create(['name' => 'الرياضيات', 'language' => 'عربي']);
    $this->gradeSubject = GradeSubject::factory()->create([
        'grade_id' => $this->grade11->id,
        'subject_id' => $this->subject->id,
        'min_marks' => 50,
        'max_marks' => 100,
        'language' => 'عربي',
        'components' => [
            ['id' => 'final', 'name' => 'الامتحان النهائي', 'marks' => 100, 'is_final_exam' => true],
        ],
    ]);
});

it('evaluates a student who passed all subjects as passed', function () {
    $student = Student::factory()->create([
        'grade' => 5,
        'language' => 'عربي',
        'status' => 'active',
        'withdrawn' => false,
    ]);

    $exam = Exam::factory()->create([
        'grade_subject_id' => $this->gradeSubject->id,
        'academic_year' => $this->year->name,
        'component_id' => 'final',
        'marks' => 100,
        'language' => 'عربي',
        'semester' => 'الأول',
    ]);

    Marks::factory()->create([
        'student_id' => $student->id,
        'exam_id' => $exam->id,
        'marks' => 80,
        'component_id' => 'final',
        'academic_year' => $this->year->name,
        'round' => 'first',
    ]);

    $result = $this->service->evaluateStudent($student, $this->year);

    expect($result['category'])->toBe('passed');
});

it('evaluates a student who failed one subject as دور_ثاني_eligible', function () {
    $student = Student::factory()->create([
        'grade' => 5,
        'language' => 'عربي',
        'status' => 'active',
        'withdrawn' => false,
    ]);

    $exam = Exam::factory()->create([
        'grade_subject_id' => $this->gradeSubject->id,
        'academic_year' => $this->year->name,
        'component_id' => 'final',
        'marks' => 100,
        'language' => 'عربي',
        'semester' => 'الأول',
    ]);

    Marks::factory()->create([
        'student_id' => $student->id,
        'exam_id' => $exam->id,
        'marks' => 30,
        'component_id' => 'final',
        'academic_year' => $this->year->name,
        'round' => 'first',
    ]);

    $result = $this->service->evaluateStudent($student, $this->year);

    expect($result['category'])->toBe('دور_ثاني_eligible');
});

it('evaluates a grade 11 student who passed as graduated', function () {
    $student = Student::factory()->create([
        'grade' => 11,
        'language' => 'عربي',
        'status' => 'active',
        'withdrawn' => false,
    ]);

    $exam = Exam::factory()->create([
        'grade_subject_id' => $this->gradeSubject->id,
        'academic_year' => $this->year->name,
        'component_id' => 'final',
        'marks' => 100,
        'language' => 'عربي',
        'semester' => 'الأول',
    ]);

    Marks::factory()->create([
        'student_id' => $student->id,
        'exam_id' => $exam->id,
        'marks' => 90,
        'component_id' => 'final',
        'academic_year' => $this->year->name,
        'round' => 'first',
    ]);

    $result = $this->service->evaluateStudent($student, $this->year);

    expect($result['category'])->toBe('graduated');
});

it('evaluates a student with no marks as repeat', function () {
    $student = Student::factory()->create([
        'grade' => 5,
        'language' => 'عربي',
        'status' => 'active',
        'withdrawn' => false,
    ]);

    $result = $this->service->evaluateStudent($student, $this->year);

    expect($result['category'])->toBe('repeat');
});

it('excludes withdrawn students from preview', function () {
    Student::factory()->create([
        'grade' => 5,
        'language' => 'عربي',
        'withdrawn' => true,
    ]);

    $results = $this->service->preview($this->year->name, 5, 'عربي');

    expect($results)->toHaveCount(0);
});

it('excludes already graduated students from preview', function () {
    Student::factory()->create([
        'grade' => 5,
        'language' => 'عربي',
        'withdrawn' => false,
        'status' => 'graduated',
    ]);

    $results = $this->service->preview($this->year->name, 5, 'عربي');

    expect($results)->toHaveCount(0);
});

it('determines category correctly for various scenarios', function () {
    expect($this->service->determineCategory(5, [
        ['passed' => true], ['passed' => true], ['passed' => true],
    ]))->toBe('passed');

    expect($this->service->determineCategory(5, [
        ['passed' => true], ['passed' => false],
    ]))->toBe('دور_ثاني_eligible');

    expect($this->service->determineCategory(5, [
        ['passed' => false], ['passed' => false], ['passed' => false],
    ]))->toBe('repeat');

    expect($this->service->determineCategory(11, [
        ['passed' => true], ['passed' => true],
    ]))->toBe('graduated');
});

it('returns correct level for each grade', function () {
    expect($this->service->levelForGrade(1))->toBe('رياض أطفال');
    expect($this->service->levelForGrade(2))->toBe('رياض أطفال');
    expect($this->service->levelForGrade(3))->toBe('ابتدائي');
    expect($this->service->levelForGrade(8))->toBe('ابتدائي');
    expect($this->service->levelForGrade(9))->toBe('اعدادي');
    expect($this->service->levelForGrade(11))->toBe('اعدادي');
});
