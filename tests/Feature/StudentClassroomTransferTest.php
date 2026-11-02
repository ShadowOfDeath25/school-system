<?php

namespace Tests\Feature;

use App\Models\AcademicYear;
use App\Models\Classroom;
use App\Models\Student;
use App\Models\StudentEnrollment;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class StudentClassroomTransferTest extends TestCase
{
    private User $user;
    private AcademicYear $academicYear;
    private Classroom $sourceClassroom;
    private Classroom $targetClassroom;

    protected function setUp(): void
    {
        parent::setUp();

        $this->academicYear = AcademicYear::firstOrCreate(
            ['name' => '2026-2027'],
            ['active' => true]
        );

        $this->sourceClassroom = Classroom::factory()->create([
            'academic_year' => $this->academicYear->name,
            'level' => 'ابتدائي',
            'grade' => 3,
            'language' => 'عربي',
            'max_capacity' => 30,
        ]);

        $this->targetClassroom = Classroom::factory()->create([
            'academic_year' => $this->academicYear->name,
            'level' => 'ابتدائي',
            'grade' => 3,
            'language' => 'عربي',
            'max_capacity' => 30,
        ]);

        $permission = Permission::firstOrCreate(['name' => 'update students', 'guard_name' => 'web']);
        $this->user = User::factory()->create();
        $this->user->givePermissionTo($permission);
    }

    public function test_student_can_be_transferred_to_another_classroom_in_same_grade_and_language()
    {
        $student = Student::factory()->create([
            'classroom_id' => $this->sourceClassroom->id,
            'level' => 'ابتدائي',
            'grade' => 3,
            'language' => 'عربي',
            'withdrawn' => false,
            'transferred_out' => false,
        ]);

        $response = $this->actingAs($this->user)->putJson(route('students.update', $student), [
            'classroom_id' => $this->targetClassroom->id,
        ]);

        $response->assertStatus(200);

        $student->refresh();
        $this->assertEquals($this->targetClassroom->id, $student->classroom_id);

        $this->assertDatabaseHas('student_enrollments', [
            'student_id' => $student->id,
            'from_classroom_id' => $this->sourceClassroom->id,
            'to_classroom_id' => $this->targetClassroom->id,
            'from_grade' => 3,
            'to_grade' => 3,
            'from_academic_year' => $this->academicYear->name,
            'to_academic_year' => $this->academicYear->name,
            'status' => 'نقل داخلي',
            'reason' => 'نقل داخلي',
        ]);
    }

    public function test_cannot_transfer_to_full_classroom()
    {
        $fullClassroom = Classroom::factory()->create([
            'academic_year' => $this->academicYear->name,
            'level' => 'ابتدائي',
            'grade' => 3,
            'language' => 'عربي',
            'max_capacity' => 1,
        ]);

        Student::factory()->create([
            'classroom_id' => $fullClassroom->id,
            'withdrawn' => false,
            'transferred_out' => false,
        ]);

        $student = Student::factory()->create([
            'classroom_id' => $this->sourceClassroom->id,
            'level' => 'ابتدائي',
            'grade' => 3,
            'language' => 'عربي',
            'withdrawn' => false,
            'transferred_out' => false,
        ]);

        $response = $this->actingAs($this->user)->putJson(route('students.update', $student), [
            'classroom_id' => $fullClassroom->id,
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['classroom_id']);

        $student->refresh();
        $this->assertEquals($this->sourceClassroom->id, $student->classroom_id);
    }

    public function test_cannot_transfer_to_different_grade_classroom()
    {
        $differentGradeClassroom = Classroom::factory()->create([
            'academic_year' => $this->academicYear->name,
            'level' => 'ابتدائي',
            'grade' => 4,
            'language' => 'عربي',
            'max_capacity' => 30,
        ]);

        $student = Student::factory()->create([
            'classroom_id' => $this->sourceClassroom->id,
            'level' => 'ابتدائي',
            'grade' => 3,
            'language' => 'عربي',
            'withdrawn' => false,
            'transferred_out' => false,
        ]);

        $response = $this->actingAs($this->user)->putJson(route('students.update', $student), [
            'classroom_id' => $differentGradeClassroom->id,
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['classroom_id']);
    }

    public function test_cannot_transfer_to_different_language_classroom()
    {
        $languagesClassroom = Classroom::factory()->create([
            'academic_year' => $this->academicYear->name,
            'level' => 'ابتدائي',
            'grade' => 3,
            'language' => 'لغات',
            'max_capacity' => 30,
        ]);

        $student = Student::factory()->create([
            'classroom_id' => $this->sourceClassroom->id,
            'level' => 'ابتدائي',
            'grade' => 3,
            'language' => 'عربي',
            'withdrawn' => false,
            'transferred_out' => false,
        ]);

        $response = $this->actingAs($this->user)->putJson(route('students.update', $student), [
            'classroom_id' => $languagesClassroom->id,
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['classroom_id']);
    }

    public function test_cannot_transfer_to_different_academic_year_classroom()
    {
        $otherYear = AcademicYear::withoutEvents(fn () => AcademicYear::firstOrCreate(
            ['name' => '2024-2025'],
            ['active' => false]
        ));

        $otherYearClassroom = Classroom::factory()->create([
            'academic_year' => $otherYear->name,
            'level' => 'ابتدائي',
            'grade' => 3,
            'language' => 'عربي',
            'max_capacity' => 30,
        ]);

        $student = Student::factory()->create([
            'classroom_id' => $this->sourceClassroom->id,
            'level' => 'ابتدائي',
            'grade' => 3,
            'language' => 'عربي',
            'withdrawn' => false,
            'transferred_out' => false,
        ]);

        $response = $this->actingAs($this->user)->putJson(route('students.update', $student), [
            'classroom_id' => $otherYearClassroom->id,
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['classroom_id']);
    }

    public function test_cannot_transfer_withdrawn_student()
    {
        $student = Student::factory()->create([
            'classroom_id' => $this->sourceClassroom->id,
            'level' => 'ابتدائي',
            'grade' => 3,
            'language' => 'عربي',
            'withdrawn' => true,
            'transferred_out' => false,
        ]);

        $response = $this->actingAs($this->user)->putJson(route('students.update', $student), [
            'classroom_id' => $this->targetClassroom->id,
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['classroom_id']);
    }

    public function test_cannot_transfer_transferred_out_student()
    {
        $student = Student::factory()->create([
            'classroom_id' => $this->sourceClassroom->id,
            'level' => 'ابتدائي',
            'grade' => 3,
            'language' => 'عربي',
            'withdrawn' => false,
            'transferred_out' => true,
        ]);

        $response = $this->actingAs($this->user)->putJson(route('students.update', $student), [
            'classroom_id' => $this->targetClassroom->id,
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['classroom_id']);
    }

    public function test_unassigned_student_can_be_assigned_to_classroom()
    {
        $student = Student::factory()->create([
            'classroom_id' => null,
            'level' => 'ابتدائي',
            'grade' => 3,
            'language' => 'عربي',
            'withdrawn' => false,
            'transferred_out' => false,
        ]);

        $response = $this->actingAs($this->user)->putJson(route('students.update', $student), [
            'classroom_id' => $this->targetClassroom->id,
        ]);

        $response->assertStatus(200);

        $student->refresh();
        $this->assertEquals($this->targetClassroom->id, $student->classroom_id);

        $this->assertDatabaseHas('student_enrollments', [
            'student_id' => $student->id,
            'from_classroom_id' => null,
            'to_classroom_id' => $this->targetClassroom->id,
            'from_grade' => 3,
            'to_grade' => 3,
            'status' => 'نقل داخلي',
            'reason' => 'نقل داخلي',
        ]);
    }

    public function test_transfer_filters_includes_internal_direction()
    {
        $transferPermission = Permission::firstOrCreate(['name' => 'transfer students', 'guard_name' => 'web']);
        $this->user->givePermissionTo($transferPermission);

        $response = $this->actingAs($this->user)->getJson('/api/transfers/filters');

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'value' => 'internal',
            'label' => 'نقل داخلي',
        ]);
    }

    public function test_transfer_history_includes_internal_classroom_transfers()
    {
        $transferPermission = Permission::firstOrCreate(['name' => 'transfer students', 'guard_name' => 'web']);
        $this->user->givePermissionTo($transferPermission);

        $student = Student::factory()->create([
            'classroom_id' => $this->sourceClassroom->id,
            'level' => 'ابتدائي',
            'grade' => 3,
            'language' => 'عربي',
            'withdrawn' => false,
            'transferred_out' => false,
        ]);

        StudentEnrollment::create([
            'student_id' => $student->id,
            'from_grade' => 3,
            'to_grade' => 3,
            'from_classroom_id' => $this->sourceClassroom->id,
            'to_classroom_id' => $this->targetClassroom->id,
            'from_academic_year' => $this->academicYear->name,
            'to_academic_year' => $this->academicYear->name,
            'status' => 'نقل داخلي',
            'reason' => 'نقل داخلي',
            'enrolled_at' => now(),
        ]);

        // Test with direction=internal filter
        $response = $this->actingAs($this->user)->getJson('/api/transfers/history?direction=internal');
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'student_id' => $student->id,
            'direction' => 'internal',
            'other_school_name' => "من: {$this->sourceClassroom->name} إلى: {$this->targetClassroom->name}",
            'notes' => 'نقل داخلي',
        ]);

        // Test with all directions (no filter)
        $allResponse = $this->actingAs($this->user)->getJson('/api/transfers/history');
        $allResponse->assertStatus(200);
        $allResponse->assertJsonFragment([
            'student_id' => $student->id,
            'direction' => 'internal',
        ]);
    }
}
