<?php

use App\Models\Guardian;
use App\Models\Student;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

it('computes full name when male parent relation is loaded', function () {
    $student = new Student([
        'name_in_arabic' => 'أحمد',
        'name_in_english' => 'Ahmed',
    ]);

    $father = new Guardian([
        'name' => 'محمد علي',
        'gender' => 'male',
    ]);

    $student->setRelation('parents', collect([$father]));

    expect($student->father)->toBe($father)
        ->and($student->father_name)->toBe('محمد علي')
        ->and($student->full_name)->toBe('أحمد محمد علي');
});

it('keeps name unchanged when no parents are loaded or present', function () {
    $student = new Student([
        'name_in_arabic' => 'أحمد',
    ]);
    $student->setRelation('parents', collect());

    expect($student->father)->toBeNull()
        ->and($student->father_name)->toBeNull()
        ->and($student->full_name)->toBe('أحمد');
});

it('does not fall back to female parent as father', function () {
    $student = new Student([
        'name_in_arabic' => 'أحمد',
    ]);

    $mother = new Guardian([
        'name' => 'فاطمة محمود',
        'gender' => 'female',
    ]);

    $student->setRelation('parents', collect([$mother]));

    expect($student->father)->toBeNull()
        ->and($student->father_name)->toBeNull()
        ->and($student->full_name)->toBe('أحمد');
});

it('does not duplicate father name for legacy records', function () {
    $student = new Student([
        'name_in_arabic' => 'أحمد محمد علي',
    ]);

    $father = new Guardian([
        'name' => 'محمد علي',
        'gender' => 'male',
    ]);

    $student->setRelation('parents', collect([$father]));

    expect($student->full_name)->toBe('أحمد محمد علي');
});

it('resolves father from guardian relation if male', function () {
    $student = new Student([
        'name_in_arabic' => 'محمود',
    ]);

    $guardian = new Guardian([
        'name' => 'حسن إبراهيم',
        'gender' => 'male',
    ]);

    $student->setRelation('guardian', $guardian);

    expect($student->father)->toBe($guardian)
        ->and($student->full_name)->toBe('محمود حسن إبراهيم');
});

it('filters students via searchByFullName scope with single term, two-part term, and extra whitespace', function () {
    $father1 = Guardian::factory()->state(['gender' => 'male', 'name' => 'محمد علي'])->create();
    $student1 = Student::factory()->create([
        'name_in_arabic' => 'أحمد',
        'name_in_english' => 'Ahmed',
        'nid' => '11111111111111',
        'reg_number' => 'REG001',
    ]);
    $student1->parents()->attach($father1->id);

    $father2 = Guardian::factory()->state(['gender' => 'male', 'name' => 'إبراهيم حسن'])->create();
    $student2 = Student::factory()->create([
        'name_in_arabic' => 'خالد',
        'name_in_english' => 'Khaled',
        'nid' => '22222222222222',
        'reg_number' => 'REG002',
    ]);
    $student2->parents()->attach($father2->id);

    // Single term matches first name
    $singleMatch = Student::searchByFullName('أحمد')->pluck('id');
    expect($singleMatch)->toContain($student1->id)
        ->and($singleMatch)->not->toContain($student2->id);

    // Two-part term matches first name + father name
    $twoPartMatch = Student::searchByFullName('أحمد محمد')->pluck('id');
    expect($twoPartMatch)->toContain($student1->id)
        ->and($twoPartMatch)->not->toContain($student2->id);

    // Two-part term with irregular spaces
    $spacesMatch = Student::searchByFullName('  أحمد    محمد   ')->pluck('id');
    expect($spacesMatch)->toContain($student1->id)
        ->and($spacesMatch)->not->toContain($student2->id);

    // Matching father name only
    $parentMatch = Student::searchByFullName('إبراهيم')->pluck('id');
    expect($parentMatch)->toContain($student2->id)
        ->and($parentMatch)->not->toContain($student1->id);
});

it('correctly searches full name through StudentController index', function () {
    $father = Guardian::factory()->state(['gender' => 'male', 'name' => 'محمد علي'])->create();
    $student = Student::factory()->create([
        'name_in_arabic' => 'أحمد',
        'name_in_english' => 'Ahmed',
        'nid' => '33333333333333',
        'reg_number' => 'REG003',
    ]);
    $student->parents()->attach($father->id);

    $controller = new \App\Http\Controllers\StudentController;
    $request = \Illuminate\Http\Request::create('/api/students', 'GET', ['search' => 'أحمد محمد']);

    $response = $controller->index($request);
    $resourceCollection = $response->resource;

    expect($resourceCollection->total())->toBe(1)
        ->and($resourceCollection->first()->full_name)->toBe('أحمد محمد علي');
});

it('correctly maps father and mother in StudentResource without assigning mother as father', function () {
    $mother = new Guardian([
        'name' => 'فاطمة محمود',
        'gender' => 'female',
        'nid' => '99999999999999',
    ]);
    $student = new Student([
        'id' => 10,
        'name_in_arabic' => 'يوسف',
        'nid' => '88888888888888',
    ]);
    $student->setRelation('parents', collect([$mother]));

    $resource = (new \App\Http\Resources\StudentResource($student))->toArray(request());

    expect($resource['father_name'])->toBe('غير مسجل')
        ->and($resource['father_nid'])->toBe('')
        ->and($resource['mother_name'])->toBe('فاطمة محمود')
        ->and($resource['mother_nid'])->toBe('99999999999999')
        ->and($resource['full_name'])->toBe('يوسف');
});


