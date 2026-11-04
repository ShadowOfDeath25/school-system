<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\AcademicYear;
use App\Models\Classroom;
use App\Models\Guardian;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class ClassroomRosterReportTest extends TestCase
{
    use DatabaseTransactions;
    private User $user;
    private AcademicYear $academicYear;
    private Classroom $classroom1;
    private Classroom $classroom2;

    protected function setUp(): void
    {
        parent::setUp();

        $this->academicYear = AcademicYear::firstOrCreate(
            ['name' => '2026-2027'],
            ['active' => true]
        );

        $this->classroom1 = Classroom::factory()->create([
            'name' => '1/1 ابتدائي',
            'academic_year' => $this->academicYear->name,
            'level' => 'ابتدائي',
            'grade' => 3,
            'language' => 'عربي',
            'class_number' => 1,
            'max_capacity' => 30,
        ]);

        $this->classroom2 = Classroom::factory()->create([
            'name' => '1/2 ابتدائي',
            'academic_year' => $this->academicYear->name,
            'level' => 'ابتدائي',
            'grade' => 3,
            'language' => 'عربي',
            'class_number' => 2,
            'max_capacity' => 30,
        ]);

        $guardian = Guardian::factory()->create([
            'name' => 'أحمد محمود',
            'phone_number' => fake()->unique()->numerify('010########'),
            'gender' => 'male',
        ]);

        Student::factory()->create([
            'name_in_arabic' => 'محمد أحمد',
            'classroom_id' => $this->classroom1->id,
            'guardian_id' => $guardian->id,
            'level' => 'ابتدائي',
            'grade' => 3,
            'language' => 'عربي',
            'gender' => 'male',
            'religion' => 'مسلم',
            'status' => 'مستجد',
            'withdrawn' => false,
            'transferred_out' => false,
        ]);

        Student::factory()->create([
            'name_in_arabic' => 'سارة أحمد',
            'classroom_id' => $this->classroom2->id,
            'guardian_id' => $guardian->id,
            'level' => 'ابتدائي',
            'grade' => 3,
            'language' => 'عربي',
            'gender' => 'female',
            'religion' => 'مسلم',
            'status' => 'مقيد',
            'withdrawn' => false,
            'transferred_out' => false,
        ]);

        $permission = Permission::firstOrCreate(['name' => 'view student-reports', 'guard_name' => 'web']);
        $this->user = User::factory()->create();
        $this->user->givePermissionTo($permission);
    }

    public function test_can_generate_classroom_roster_pdf(): void
    {
        $response = $this->actingAs($this->user)->getJson(route('reports.students.classroom-roster', [
            'academic_year' => $this->academicYear->name,
            'level' => 'ابتدائي',
            'grade' => 3,
        ]));

        $response->assertStatus(200);
        $response->assertJsonStructure(['uuid', 'preview_url']);
    }

    public function test_can_export_classroom_roster_to_excel(): void
    {
        Excel::fake();

        $response = $this->actingAs($this->user)->get(route('reports.students.classroom-roster', [
            'academic_year' => $this->academicYear->name,
            'level' => 'ابتدائي',
            'grade' => 3,
            'export' => 'excel',
        ]));

        $response->assertStatus(200);
        Excel::assertDownloaded('classroom_roster.xlsx');
    }

    public function test_can_filter_by_specific_classroom(): void
    {
        $response = $this->actingAs($this->user)->getJson(route('reports.students.classroom-roster', [
            'academic_year' => $this->academicYear->name,
            'level' => 'ابتدائي',
            'grade' => 3,
            'classroom' => $this->classroom1->id,
        ]));

        $response->assertStatus(200);
        $response->assertJsonStructure(['uuid', 'preview_url']);
    }

    public function test_unauthorized_user_cannot_view_classroom_roster(): void
    {
        $unauthorizedUser = User::factory()->create();

        $response = $this->actingAs($unauthorizedUser)->getJson(route('reports.students.classroom-roster', [
            'academic_year' => $this->academicYear->name,
        ]));

        $response->assertStatus(403);
    }
}
