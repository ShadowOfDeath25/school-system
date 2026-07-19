<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Classroom;
use App\Models\Grade;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PromotionTestSeeder extends Seeder
{
    public function run(): void
    {
        $year = '2025/2026';
        $lang = 'عربي';

        Student::where('nid', 'like', 'SEED%')->delete();
        DB::table('marks')->where('academic_year', $year)->delete();
        DB::table('exams')->where('academic_year', $year)->delete();
        DB::table('grade_subject')->where('language', $lang)->delete();

        $academicYear = AcademicYear::firstOrCreate(
            ['name' => $year],
            ['active' => true]
        );

        $grade3 = Grade::firstOrCreate(['grade' => 3], ['name' => 'الاول الابتدائي']);
        $grade11 = Grade::firstOrCreate(['grade' => 11], ['name' => 'الثالث الاعدادي']);

        $subjectNames = ['اللغة العربية', 'الرياضيات', 'العلوم', 'الدراسات الاجتماعية'];
        $subjects = [];
        foreach ($subjectNames as $name) {
            $subjects[$name] = Subject::firstOrCreate(
                ['name' => $name, 'language' => $lang],
                ['type' => 'عام']
            );
        }

        $components = [['id' => 'final', 'name' => 'الامتحان النهائي', 'marks' => 50, 'is_final_exam' => true]];

        $gradeSubjectIds = [];
        foreach ([3 => $grade3, 11 => $grade11] as $gNum => $grade) {
            foreach ($subjects as $name => $subject) {
                $gsId = DB::table('grade_subject')->insertGetId([
                    'subject_id' => $subject->id,
                    'grade_id' => $grade->id,
                    'language' => $lang,
                    'min_marks' => 25,
                    'max_marks' => 50,
                    'added_to_total' => true,
                    'added_to_report' => true,
                    'semester' => 'الأول',
                    'components' => json_encode($components),
                ]);
                $gradeSubjectIds[$gNum][$name] = $gsId;
            }
        }

        $examIds = [];
        foreach ($gradeSubjectIds as $gNum => $subjectMap) {
            foreach ($subjectMap as $name => $gsId) {
                $examId = DB::table('exams')->insertGetId([
                    'grade_subject_id' => $gsId,
                    'component_id' => 'final',
                    'academic_year' => $year,
                    'name' => 'الامتحان النهائي',
                    'date' => '2026-05-01 09:00:00',
                    'type' => 'امتحان',
                    'marks' => 50,
                    'language' => $lang,
                    'semester' => 'الأول',
                    'duration_in_hours' => 2,
                ]);
                $examIds[$gNum][$name] = $examId;
            }
        }

        $classroom3 = Classroom::firstOrCreate(
            ['grade' => 3, 'language' => $lang, 'academic_year' => $year, 'class_number' => 99],
            [
                'level' => 'ابتدائي',
                'name' => '99/1 ابتدائي',
                'max_capacity' => 30,
            ]
        );
        $classroom11 = Classroom::firstOrCreate(
            ['grade' => 11, 'language' => $lang, 'academic_year' => $year, 'class_number' => 99],
            [
                'level' => 'اعدادي',
                'name' => '99/3 اعدادي',
                'max_capacity' => 30,
            ]
        );

        $guardian = DB::table('guardians')->where('phone_number', '00000000000')->first();
        if (! $guardian) {
            $guardianId = DB::table('guardians')->insertGetId([
                'name' => 'ولي الأمر الافتراضي',
                'gender' => 'male',
                'phone_number' => '00000000000',
                'job' => 'موظف',
                'edu' => 'جامعي',
            ]);
        } else {
            $guardianId = $guardian->id;
        }

        $studentData = [
            ['name' => 'طالب ناجح أ', 'marks' => ['اللغة العربية' => 45, 'الرياضيات' => 40, 'العلوم' => 38, 'الدراسات الاجتماعية' => 35], 'expected' => 'passed'],
            ['name' => 'طالب ناجح ب', 'marks' => ['اللغة العربية' => 35, 'الرياضيات' => 30, 'العلوم' => 28, 'الدراسات الاجتماعية' => 25], 'expected' => 'passed'],
            ['name' => 'طالب دور ثاني 1', 'marks' => ['اللغة العربية' => 20, 'الرياضيات' => 30, 'العلوم' => 35, 'الدراسات الاجتماعية' => 28], 'expected' => 'دور_ثاني'],
            ['name' => 'طالب دور ثاني 2', 'marks' => ['اللغة العربية' => 18, 'الرياضيات' => 22, 'العلوم' => 30, 'الدراسات الاجتماعية' => 30], 'expected' => 'دور_ثاني'],
            ['name' => 'طالب راسب 3', 'marks' => ['اللغة العربية' => 15, 'الرياضيات' => 12, 'العلوم' => 20, 'الدراسات الاجتماعية' => 30], 'expected' => 'repeat'],
            ['name' => 'طالب راسب 4', 'marks' => ['اللغة العربية' => 10, 'الرياضيات' => 8, 'العلوم' => 15, 'الدراسات الاجتماعية' => 12], 'expected' => 'repeat'],
            ['name' => 'طالب منسحب', 'marks' => null, 'withdrawn' => true, 'expected' => 'excluded'],
            ['name' => 'طالب متخرج سابقاً', 'marks' => ['اللغة العربية' => 30, 'الرياضيات' => 28, 'العلوم' => 32, 'الدراسات الاجتماعية' => 25], 'status' => 'graduated', 'expected' => 'excluded'],
            ['name' => 'طالب بلا درجات', 'marks' => null, 'expected' => 'incomplete'],
            ['name' => 'طالب متخرج أ', 'marks' => ['اللغة العربية' => 45, 'الرياضيات' => 40, 'العلوم' => 38, 'الدراسات الاجتماعية' => 35], 'grade' => 11, 'expected' => 'graduated'],
            ['name' => 'طالب متخرج ب', 'marks' => ['اللغة العربية' => 35, 'الرياضيات' => 30, 'العلوم' => 28, 'الدراسات الاجتماعية' => 25], 'grade' => 11, 'expected' => 'graduated'],
        ];

        foreach ($studentData as $data) {
            $isGrade11 = ($data['grade'] ?? 3) === 11;
            $classroom = $isGrade11 ? $classroom11 : $classroom3;
            $gNum = $isGrade11 ? 11 : 3;

            $student = Student::create([
                'name_in_arabic' => $data['name'],
                'name_in_english' => $data['name'],
                'nid' => 'SEED' . str_pad((string) random_int(0, 99999999), 8, '0', STR_PAD_LEFT),
                'birth_date' => '2015-01-01',
                'birth_address' => 'القاهرة',
                'gender' => 'male',
                'religion' => 'مسلم',
                'nationality' => 'مصري',
                'language' => $lang,
                'level' => $isGrade11 ? 'اعدادي' : 'ابتدائي',
                'grade' => $data['grade'] ?? 3,
                'classroom_id' => ($data['withdrawn'] ?? false) ? null : $classroom->id,
                'withdrawn' => $data['withdrawn'] ?? false,
                'status' => $data['status'] ?? 'active',
            ]);

            DB::table('guardian_student')->insert([
                'student_id' => $student->id,
                'guardian_id' => $guardianId,
            ]);

            if ($data['marks']) {
                foreach ($data['marks'] as $subjName => $markValue) {
                    DB::table('marks')->insert([
                        'student_id' => $student->id,
                        'exam_id' => $examIds[$gNum][$subjName],
                        'marks' => $markValue,
                        'component_id' => 'final',
                        'academic_year' => $year,
                        'round' => 'first',
                    ]);
                }
            }
        }

        $this->command->info('PromotionTestSeeder: 11 students seeded across all promotion cases.');
    }
}
