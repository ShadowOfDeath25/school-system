<?php

use App\Models\AcademicYear;
use App\Models\Classroom;
use App\Models\Exam;
use App\Models\Grade;
use App\Models\GradeSubject;
use App\Models\Marks;
use App\Models\Student;
use App\Models\Subject;
use App\Models\User;
use App\Models\SubjectType;
use App\Services\Promotion\PromotionEngineService;
uses(\Illuminate\Foundation\Testing\DatabaseTransactions::class);
beforeEach(function () {
    SubjectType::create(['name' => 'academic']);
    $this->engine = app(PromotionEngineService::class);
    $this->user = User::factory()->create();
    $this->fromYear = AcademicYear::factory()->create(['name' => '2025/2026', 'active' => true]);
    $this->toYear = AcademicYear::factory()->create(['name' => '2026/2027', 'active' => false]);
    $this->gradeModel = Grade::factory()->create(['grade' => 5, 'name' => 'الصف الخامس']);
    $this->subject = Subject::factory()->create(['name' => 'الرياضيات', 'language' => 'عربي']);
    $this->gradeSubject = GradeSubject::create([
        'grade_id' => $this->gradeModel->id,
        'subject_id' => $this->subject->id,
        'min_marks' => 50,
        'max_marks' => 100,
        'language' => 'عربي',
        'semester' => 'الأول',
        'components' => [
            ['id' => 'final', 'name' => 'الامتحان النهائي', 'marks' => 100, 'is_final_exam' => true],
        ],
    ]);
    Classroom::factory()->create([
        'grade' => 6,
        'language' => 'عربي',
        'level' => 'ابتدائي',
        'class_number' => 1,
        'max_capacity' => 30,
        'academic_year' => '2026/2027',
    ]);
});

it('executes promotion for passing students', function () {
    $student = Student::factory()->create([
        'grade' => 5,
        'language' => 'عربي',
        'level' => 'ابتدائي',
        'status' => 'نشط',
        'withdrawn' => false,
    ]);

    $exam = Exam::factory()->create([
        'grade_subject_id' => $this->gradeSubject->id,
        'academic_year' => '2025/2026',
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
        'academic_year' => '2025/2026',
        'round' => 'first',
    ]);

    $batch = $this->engine->execute('2025/2026', 5, null, $this->user);

    expect($batch->status)->toBe('completed');
    expect($batch->promoted_count)->toBe(1);
    expect($batch->total_students)->toBe(1);

    $student->refresh();
    expect($student->grade)->toBe(6);
});

it('processes mixed results in a single batch', function () {
    $passingStudent = Student::factory()->create([
        'grade' => 5, 'language' => 'عربي', 'level' => 'ابتدائي',
        'status' => 'نشط', 'withdrawn' => false,
    ]);

    $failingStudent = Student::factory()->create([
        'grade' => 5, 'language' => 'عربي', 'level' => 'ابتدائي',
        'status' => 'نشط', 'withdrawn' => false,
    ]);

    $exam = Exam::factory()->create([
        'grade_subject_id' => $this->gradeSubject->id,
        'academic_year' => '2025/2026',
        'component_id' => 'final',
        'marks' => 100,
        'language' => 'عربي',
        'semester' => 'الأول',
    ]);

    Marks::factory()->create([
        'student_id' => $passingStudent->id,
        'exam_id' => $exam->id,
        'marks' => 80,
        'component_id' => 'final',
        'academic_year' => '2025/2026',
        'round' => 'first',
    ]);

    Marks::factory()->create([
        'student_id' => $failingStudent->id,
        'exam_id' => $exam->id,
        'marks' => 20,
        'component_id' => 'final',
        'academic_year' => '2025/2026',
        'round' => 'first',
    ]);

    $batch = $this->engine->execute('2025/2026', 5, null, $this->user);

    expect($batch->promoted_count)->toBe(1);
    expect($batch->total_students)->toBe(2);
});

it('prevents duplicate batch for same year pair', function () {
    $this->engine->execute('2025/2026', 5, [], $this->user);

    $this->expectException(\RuntimeException::class);
    $this->engine->execute('2025/2026', 5, [], $this->user);
});

it('rolls back a batch correctly', function () {
    $student = Student::factory()->create([
        'grade' => 5, 'language' => 'عربي', 'level' => 'ابتدائي',
        'status' => 'نشط', 'withdrawn' => false,
    ]);

    $exam = Exam::factory()->create([
        'grade_subject_id' => $this->gradeSubject->id,
        'academic_year' => '2025/2026',
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
        'academic_year' => '2025/2026',
        'round' => 'first',
    ]);

    $batch = $this->engine->execute('2025/2026', 5, null, $this->user);

    $rollbackService = app(\App\Services\Promotion\RollbackService::class);
    $rollbackService->rollback($batch, $this->user);

    $batch->refresh();
    expect($batch->status)->toBe('rolled_back');

    $student->refresh();
    expect($student->grade)->toBe(5);
    expect($student->status)->toBe('نشط');
});
