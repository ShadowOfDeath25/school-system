<?php

namespace Tests\Feature;

use App\Models\AcademicYear;
use App\Models\Classroom;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class IdCardTest extends TestCase
{
    public function test_can_generate_id_cards_pdf()
    {
        $year = AcademicYear::firstOrCreate(['name' => '2026-2027'], ['active' => true]);
        
        $classroom = Classroom::factory()->create([
            'academic_year' => $year->name,
            'level' => 'ابتدائي',
            'grade' => 3,
            'language' => 'عربي',
        ]);

        $student = Student::factory()->create([
            'classroom_id' => $classroom->id,
            'level' => 'ابتدائي',
            'grade' => 3,
            'language' => 'عربي',
            'withdrawn' => false,
            'transferred_out' => false,
        ]);

        $permission = Permission::firstOrCreate(['name' => 'view student-reports', 'guard_name' => 'web']);
        $user = User::factory()->create();
        $user->givePermissionTo($permission);

        $response = $this->actingAs($user)->getJson(route('reports.students.id-cards', [
            'academic_year' => $year->name,
            'grade' => 3,
            'classroom' => $classroom->id,
            'layout' => 'grid',
        ]));

        $response->assertStatus(200);
        $response->assertJsonStructure(['uuid', 'preview_url']);
    }

    public function test_can_generate_single_student_id_card()
    {
        $year = AcademicYear::firstOrCreate(['name' => '2026-2027'], ['active' => true]);

        $classroom = Classroom::factory()->create([
            'academic_year' => $year->name,
        ]);

        $student = Student::factory()->create([
            'classroom_id' => $classroom->id,
        ]);

        $permission = Permission::firstOrCreate(['name' => 'view student-reports', 'guard_name' => 'web']);
        $user = User::factory()->create();
        $user->givePermissionTo($permission);

        $response = $this->actingAs($user)->getJson(route('reports.students.id-cards', [
            'academic_year' => $year->name,
            'student_id' => $student->id,
            'layout' => 'single',
        ]));

        $response->assertStatus(200);
        $response->assertJsonStructure(['uuid', 'preview_url']);
    }
}
