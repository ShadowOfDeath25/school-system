<?php

use App\Models\Guardian;
use App\Models\Student;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

it('allows creating multiple guardians with null phone numbers', function () {
    $parent1 = Guardian::create([
        'name' => 'أحمد محمد',
        'gender' => 'male',
        'phone_number' => null,
        'edu' => 'جامعي',
        'job' => 'مهندس',
        'nid' => '11111111111111',
    ]);

    $parent2 = Guardian::create([
        'name' => 'فاطمة علي',
        'gender' => 'female',
        'phone_number' => null,
        'edu' => 'جامعي',
        'job' => 'معلمة',
        'nid' => '22222222222222',
    ]);

    expect($parent1->exists)->toBeTrue()
        ->and($parent2->exists)->toBeTrue()
        ->and($parent1->phone_number)->toBeNull()
        ->and($parent2->phone_number)->toBeNull();
});

it('passes StoreParentRequest validation when phone_number is null or omitted', function () {
    $student = Student::factory()->create();

    $rules = (new \App\Http\Requests\Parent\StoreParentRequest)->rules();

    $data = [
        'name' => 'والد تجريبي',
        'gender' => 'male',
        'edu' => 'جامعي',
        'student_id' => $student->id,
        'job' => 'موظف',
        'nid' => '33333333333333',
        'phone_number' => null,
    ];

    $validator = Validator::make($data, $rules);
    expect($validator->passes())->toBeTrue();
});

it('passes StoreStudentRequest validation when parent phone numbers are null', function () {
    $rules = (new \App\Http\Requests\Student\StoreStudentRequest)->rules();

    $data = [
        'name_in_arabic' => 'طالب تجريبي',
        'name_in_english' => 'Student Test',
        'nid' => '44444444444444',
        'birth_date' => '2016-01-01',
        'birth_address' => 'القاهرة',
        'language' => 'عربي',
        'status' => 'مستجد',
        'gender' => 'male',
        'religion' => 'مسلم',
        'nationality' => 'مصري',
        'grade' => 3,
        'level' => 'ابتدائي',
        'parent_mode' => 'first',
        'parents' => [
            [
                'name' => 'الأب',
                'gender' => 'male',
                'nid' => '55555555555555',
                'phone_number' => null,
            ],
            [
                'name' => 'الأم',
                'gender' => 'female',
                'nid' => '66666666666666',
                'phone_number' => null,
            ],
        ],
        'guardian_type' => 'father',
    ];

    $validator = Validator::make($data, $rules);
    expect($validator->passes())->toBeTrue();
});
