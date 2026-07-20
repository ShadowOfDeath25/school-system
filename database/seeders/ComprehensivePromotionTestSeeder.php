<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Classroom;
use App\Models\Grade;
use App\Models\GradeSubject;
use App\Models\SecretNumber;
use App\Models\SeatNumber;
use App\Models\Student;
use App\Models\Subject;
use App\Services\SeatAssignmentService;
use App\Services\SecretAssignmentService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ComprehensivePromotionTestSeeder extends Seeder
{
    private string $year = '2025/2026';

    private array $levelConfig = [
        'رياض أطفال' => ['min_marks' => 15, 'max_marks' => 30],
        'ابتدائي'    => ['min_marks' => 25, 'max_marks' => 50],
        'اعدادي'     => ['min_marks' => 30, 'max_marks' => 60],
    ];

    public function run(): void
    {
        $this->cleanup();

        AcademicYear::firstOrCreate(['name' => $this->year], ['active' => true]);

        $this->createSubjectsIfNeeded();

        $gradeSubjectMap = $this->assignSubjectsToGrades();

        $classrooms = $this->createClassrooms();

        $guardianId = $this->createDefaultGuardian();

        $students = $this->createStudents($classrooms, $guardianId);

        $this->createSecretNumbers();
        app(SecretAssignmentService::class)->assign($this->year);

        $this->createSeatNumbers();
        app(SeatAssignmentService::class)->assign($this->year);

        $exams = $this->createExams($gradeSubjectMap);

        $this->createMarks($students, $exams);

        $count = count($students);
        $this->command->info("ComprehensivePromotionTestSeeder: {$count} students seeded across all promotion cases.");
    }

    private function cleanup(): void
    {
        $studentIds = Student::where('nid', 'like', 'SEED%')->pluck('id');

        if ($studentIds->isNotEmpty()) {
            DB::table('guardian_student')->whereIn('student_id', $studentIds)->delete();
            DB::table('marks')->whereIn('student_id', $studentIds)->delete();
            DB::table('student_seat_assignments')->whereIn('student_id', $studentIds)->delete();
            DB::table('student_secret_assignments')->whereIn('student_id', $studentIds)->delete();
            DB::table('promotion_batch_students')->whereIn('student_id', $studentIds)->delete();
            DB::table('student_enrollments')->whereIn('student_id', $studentIds)->delete();
            Student::whereIn('id', $studentIds)->delete();
        }

        DB::table('exams')->where('academic_year', $this->year)->delete();

        $gradeIds = Grade::whereIn('grade', [1, 3, 5, 9, 11])->pluck('id');
        DB::table('grade_subject')->whereIn('grade_id', $gradeIds)
            ->whereIn('language', ['عربي', 'لغات'])
            ->delete();

        DB::table('secret_numbers')->where('academic_year', $this->year)->delete();
        DB::table('seat_numbers')->where('academic_year', $this->year)->delete();
    }

    private function createSubjectsIfNeeded(): void
    {
        $subjects = [
            ['name' => 'اللغة العربية', 'language' => 'عربي', 'type' => 'عام'],
            ['name' => 'اللغة الإنجليزية', 'language' => 'عربي', 'type' => 'عام'],
            ['name' => 'الرياضيات', 'language' => 'عربي', 'type' => 'عام'],
            ['name' => 'العلوم', 'language' => 'عربي', 'type' => 'عام'],
            ['name' => 'الدراسات الاجتماعية', 'language' => 'عربي', 'type' => 'عام'],
            ['name' => 'التربية الدينية', 'language' => 'عربي', 'type' => 'عام'],
            ['name' => 'Arabic', 'language' => 'لغات', 'type' => 'عام'],
            ['name' => 'English', 'language' => 'لغات', 'type' => 'عام'],
            ['name' => 'Mathematics', 'language' => 'لغات', 'type' => 'عام'],
            ['name' => 'Science', 'language' => 'لغات', 'type' => 'عام'],
            ['name' => 'Social Studies', 'language' => 'لغات', 'type' => 'عام'],
            ['name' => 'ICT', 'language' => 'لغات', 'type' => 'عام'],
        ];

        foreach ($subjects as $s) {
            Subject::firstOrCreate(
                ['name' => $s['name'], 'language' => $s['language']],
                ['type' => $s['type']],
            );
        }
    }

    private function assignSubjectsToGrades(): array
    {
        $map = [];

        $definitions = [
            1 => ['عربي' => ['رياض أطفال', ['اللغة العربية', 'الرياضيات']]],
            3 => [
                'عربي' => ['ابتدائي', ['اللغة العربية', 'اللغة الإنجليزية', 'الرياضيات', 'العلوم', 'الدراسات الاجتماعية']],
                'لغات' => ['ابتدائي', ['Arabic', 'English', 'Mathematics', 'Science', 'Social Studies']],
            ],
            5 => ['عربي' => ['ابتدائي', ['اللغة العربية', 'اللغة الإنجليزية', 'الرياضيات', 'العلوم', 'الدراسات الاجتماعية']]],
            9 => ['عربي' => ['اعدادي', ['اللغة العربية', 'اللغة الإنجليزية', 'الرياضيات', 'العلوم', 'الدراسات الاجتماعية', 'التربية الدينية']]],
            11 => ['عربي' => ['اعدادي', ['اللغة العربية', 'اللغة الإنجليزية', 'الرياضيات', 'العلوم', 'الدراسات الاجتماعية', 'التربية الدينية']]],
        ];

        foreach ($definitions as $gradeNum => $langs) {
            $grade = Grade::where('grade', $gradeNum)->first();
            foreach ($langs as $lang => [$level, $subjectNames]) {
                $cfg = $this->levelConfig[$level];
                $componentMarks = $cfg['max_marks'];
                $components = json_encode([['id' => 'final', 'name' => 'الامتحان النهائي', 'marks' => $componentMarks, 'is_final_exam' => true]]);

                foreach ($subjectNames as $subjectName) {
                    $subject = Subject::where('name', $subjectName)->where('language', $lang)->first();
                    $gsId = DB::table('grade_subject')->insertGetId([
                        'subject_id' => $subject->id,
                        'grade_id' => $grade->id,
                        'min_marks' => $cfg['min_marks'],
                        'max_marks' => $cfg['max_marks'],
                        'added_to_total' => true,
                        'added_to_report' => true,
                        'semester' => 'الأول',
                        'language' => $lang,
                        'components' => $components,
                    ]);
                    $map[$gradeNum][$lang][$subjectName] = $gsId;
                }
            }
        }

        return $map;
    }

    private function createClassrooms(): array
    {
        $classrooms = [];
        $combos = [
            ['grade' => 1, 'lang' => 'عربي', 'level' => 'رياض أطفال'],
            ['grade' => 3, 'lang' => 'عربي', 'level' => 'ابتدائي'],
            ['grade' => 3, 'lang' => 'لغات', 'level' => 'ابتدائي'],
            ['grade' => 5, 'lang' => 'عربي', 'level' => 'ابتدائي'],
            ['grade' => 9, 'lang' => 'عربي', 'level' => 'اعدادي'],
            ['grade' => 11, 'lang' => 'عربي', 'level' => 'اعدادي'],
        ];

        foreach ($combos as $c) {
            $classroom = Classroom::firstOrCreate(
                [
                    'grade' => $c['grade'],
                    'language' => $c['lang'],
                    'academic_year' => $this->year,
                    'class_number' => 98,
                ],
                [
                    'level' => $c['level'],
                    'name' => '98/' . getGradeNumber($c['grade']) . ' ' . $c['level'],
                    'max_capacity' => 50,
                ],
            );
            $classrooms[$c['grade']][$c['lang']] = $classroom->id;
        }

        return $classrooms;
    }

    private function createDefaultGuardian(): int
    {
        $guardian = DB::table('guardians')->where('phone_number', '00000000000')->first();
        if ($guardian) {
            return $guardian->id;
        }

        return DB::table('guardians')->insertGetId([
            'name' => 'ولي الأمر الافتراضي',
            'gender' => 'male',
            'phone_number' => '00000000000',
            'job' => 'موظف',
            'edu' => 'جامعي',
        ]);
    }

    private function createStudents(array $classrooms, int $guardianId): array
    {
        $definitions = $this->getStudentDefinitions();
        $created = [];

        foreach ($definitions as $data) {
            $isWithdrawn = $data['withdrawn'] ?? false;
            $status = $data['status'] ?? 'active';
            $level = getLevel($data['grade']);

            $student = Student::create([
                'name_in_arabic' => $data['name'],
                'name_in_english' => $data['name'],
                'nid' => 'SEED' . str_pad((string) random_int(0, 99999999), 8, '0', STR_PAD_LEFT),
                'birth_date' => '2015-01-01',
                'birth_address' => 'القاهرة',
                'gender' => 'male',
                'religion' => 'مسلم',
                'nationality' => 'مصري',
                'language' => $data['lang'],
                'level' => $level,
                'grade' => $data['grade'],
                'classroom_id' => $isWithdrawn ? null : ($classrooms[$data['grade']][$data['lang']] ?? null),
                'withdrawn' => $isWithdrawn,
                'status' => $status,
            ]);

            DB::table('guardian_student')->insert([
                'student_id' => $student->id,
                'guardian_id' => $guardianId,
            ]);

            $created[] = [
                'student' => $student,
                'marks' => $data['marks'],
                'expected' => $data['expected'],
                'grade' => $data['grade'],
                'lang' => $data['lang'],
            ];
        }

        return $created;
    }

    private function getStudentDefinitions(): array
    {
        return [
            // ===== Grade 1 (KG1) - عربي (level: رياض أطفال, min_marks=15) =====
            ['name' => 'ناجح كي جي', 'grade' => 1, 'lang' => 'عربي', 'expected' => 'passed', 'marks' => ['اللغة العربية' => 20, 'الرياضيات' => 18]],
            ['name' => 'دور ثاني كي جي', 'grade' => 1, 'lang' => 'عربي', 'expected' => 'دور_ثاني', 'marks' => ['اللغة العربية' => 12, 'الرياضيات' => 20]],

            // ===== Grade 3 (Primary 1) - عربي (level: ابتدائي, min_marks=25) =====
            ['name' => 'ناجح أ 3', 'grade' => 3, 'lang' => 'عربي', 'expected' => 'passed', 'marks' => ['اللغة العربية' => 40, 'اللغة الإنجليزية' => 35, 'الرياضيات' => 38, 'العلوم' => 30, 'الدراسات الاجتماعية' => 28]],
            ['name' => 'ناجح ب 3', 'grade' => 3, 'lang' => 'عربي', 'expected' => 'passed', 'marks' => ['اللغة العربية' => 30, 'اللغة الإنجليزية' => 28, 'الرياضيات' => 25, 'العلوم' => 35, 'الدراسات الاجتماعية' => 30]],
            ['name' => 'دور ثاني 3-1', 'grade' => 3, 'lang' => 'عربي', 'expected' => 'دور_ثاني', 'marks' => ['اللغة العربية' => 20, 'اللغة الإنجليزية' => 30, 'الرياضيات' => 35, 'العلوم' => 28, 'الدراسات الاجتماعية' => 32]],
            ['name' => 'دور ثاني 3-2', 'grade' => 3, 'lang' => 'عربي', 'expected' => 'دور_ثاني', 'marks' => ['اللغة العربية' => 22, 'اللغة الإنجليزية' => 18, 'الرياضيات' => 30, 'العلوم' => 35, 'الدراسات الاجتماعية' => 28]],
            ['name' => 'راسب 3-3', 'grade' => 3, 'lang' => 'عربي', 'expected' => 'repeat', 'marks' => ['اللغة العربية' => 15, 'اللغة الإنجليزية' => 12, 'الرياضيات' => 20, 'العلوم' => 30, 'الدراسات الاجتماعية' => 35]],
            ['name' => 'راسب 3-4', 'grade' => 3, 'lang' => 'عربي', 'expected' => 'repeat', 'marks' => ['اللغة العربية' => 10, 'اللغة الإنجليزية' => 8, 'الرياضيات' => 15, 'العلوم' => 12, 'الدراسات الاجتماعية' => 20]],
            ['name' => 'حدود ناجح 3', 'grade' => 3, 'lang' => 'عربي', 'expected' => 'passed', 'marks' => ['اللغة العربية' => 25, 'اللغة الإنجليزية' => 25, 'الرياضيات' => 25, 'العلوم' => 25, 'الدراسات الاجتماعية' => 25]],
            ['name' => 'حدود راسب 3', 'grade' => 3, 'lang' => 'عربي', 'expected' => 'دور_ثاني', 'marks' => ['اللغة العربية' => 24, 'اللغة الإنجليزية' => 30, 'الرياضيات' => 35, 'العلوم' => 28, 'الدراسات الاجتماعية' => 32]],
            ['name' => 'منسحب 3', 'grade' => 3, 'lang' => 'عربي', 'expected' => 'excluded', 'marks' => null, 'withdrawn' => true],
            ['name' => 'متخرج سابقاً 3', 'grade' => 3, 'lang' => 'عربي', 'expected' => 'excluded', 'marks' => null, 'status' => 'graduated'],
            ['name' => 'بلا درجات 3', 'grade' => 3, 'lang' => 'عربي', 'expected' => 'incomplete', 'marks' => null],

            // ===== Grade 3 (Primary 1) - لغات (level: ابتدائي, min_marks=25) =====
            ['name' => 'ناجح لغات 3', 'grade' => 3, 'lang' => 'لغات', 'expected' => 'passed', 'marks' => ['Arabic' => 40, 'English' => 35, 'Mathematics' => 38, 'Science' => 30, 'Social Studies' => 28]],
            ['name' => 'دور ثاني لغات', 'grade' => 3, 'lang' => 'لغات', 'expected' => 'دور_ثاني', 'marks' => ['Arabic' => 20, 'English' => 30, 'Mathematics' => 35, 'Science' => 28, 'Social Studies' => 32]],

            // ===== Grade 5 (Primary 3) - عربي (level: ابتدائي, min_marks=25) =====
            ['name' => 'ناجح 5', 'grade' => 5, 'lang' => 'عربي', 'expected' => 'passed', 'marks' => ['اللغة العربية' => 35, 'اللغة الإنجليزية' => 30, 'الرياضيات' => 40, 'العلوم' => 28, 'الدراسات الاجتماعية' => 32]],
            ['name' => 'دور ثاني 5', 'grade' => 5, 'lang' => 'عربي', 'expected' => 'دور_ثاني', 'marks' => ['اللغة العربية' => 20, 'اللغة الإنجليزية' => 22, 'الرياضيات' => 35, 'العلوم' => 30, 'الدراسات الاجتماعية' => 28]],

            // ===== Grade 9 (Prep 1) - عربي (level: اعدادي, min_marks=30) =====
            ['name' => 'ناجح 9', 'grade' => 9, 'lang' => 'عربي', 'expected' => 'passed', 'marks' => ['اللغة العربية' => 45, 'اللغة الإنجليزية' => 40, 'الرياضيات' => 50, 'العلوم' => 35, 'الدراسات الاجتماعية' => 32, 'التربية الدينية' => 48]],
            ['name' => 'راسب 9-3', 'grade' => 9, 'lang' => 'عربي', 'expected' => 'repeat', 'marks' => ['اللغة العربية' => 15, 'اللغة الإنجليزية' => 20, 'الرياضيات' => 18, 'العلوم' => 35, 'الدراسات الاجتماعية' => 40, 'التربية الدينية' => 30]],

            // ===== Grade 11 (Prep 3) - عربي (level: اعدادي, min_marks=30) =====
            ['name' => 'متخرج أ 11', 'grade' => 11, 'lang' => 'عربي', 'expected' => 'graduated', 'marks' => ['اللغة العربية' => 50, 'اللغة الإنجليزية' => 45, 'الرياضيات' => 48, 'العلوم' => 40, 'الدراسات الاجتماعية' => 35, 'التربية الدينية' => 55]],
            ['name' => 'متخرج ب 11', 'grade' => 11, 'lang' => 'عربي', 'expected' => 'graduated', 'marks' => ['اللغة العربية' => 35, 'اللغة الإنجليزية' => 32, 'الرياضيات' => 30, 'العلوم' => 40, 'الدراسات الاجتماعية' => 38, 'التربية الدينية' => 42]],
            ['name' => 'دور ثاني 11-1', 'grade' => 11, 'lang' => 'عربي', 'expected' => 'دور_ثاني', 'marks' => ['اللغة العربية' => 20, 'اللغة الإنجليزية' => 35, 'الرياضيات' => 40, 'العلوم' => 32, 'الدراسات الاجتماعية' => 38, 'التربية الدينية' => 45]],
            ['name' => 'دور ثاني 11-2', 'grade' => 11, 'lang' => 'عربي', 'expected' => 'دور_ثاني', 'marks' => ['اللغة العربية' => 25, 'اللغة الإنجليزية' => 22, 'الرياضيات' => 35, 'العلوم' => 40, 'الدراسات الاجتماعية' => 30, 'التربية الدينية' => 38]],
            ['name' => 'راسب 11-3', 'grade' => 11, 'lang' => 'عربي', 'expected' => 'repeat', 'marks' => ['اللغة العربية' => 15, 'اللغة الإنجليزية' => 18, 'الرياضيات' => 20, 'العلوم' => 35, 'الدراسات الاجتماعية' => 40, 'التربية الدينية' => 30]],
            ['name' => 'راسب 11-6', 'grade' => 11, 'lang' => 'عربي', 'expected' => 'repeat', 'marks' => ['اللغة العربية' => 10, 'اللغة الإنجليزية' => 8, 'الرياضيات' => 12, 'العلوم' => 15, 'الدراسات الاجتماعية' => 20, 'التربية الدينية' => 18]],
            ['name' => 'بلا درجات 11', 'grade' => 11, 'lang' => 'عربي', 'expected' => 'incomplete', 'marks' => null],
        ];
    }

    private function createSecretNumbers(): void
    {
        $configs = [
            ['grade' => 1, 'lang' => 'عربي', 'level' => 'رياض أطفال', 'start' => 100001, 'end' => 100050],
            ['grade' => 3, 'lang' => 'عربي', 'level' => 'ابتدائي', 'start' => 200001, 'end' => 200050],
            ['grade' => 3, 'lang' => 'لغات', 'level' => 'ابتدائي', 'start' => 210001, 'end' => 210050],
            ['grade' => 5, 'lang' => 'عربي', 'level' => 'ابتدائي', 'start' => 300001, 'end' => 300050],
            ['grade' => 9, 'lang' => 'عربي', 'level' => 'اعدادي', 'start' => 400001, 'end' => 400050],
            ['grade' => 11, 'lang' => 'عربي', 'level' => 'اعدادي', 'start' => 500001, 'end' => 500050],
        ];

        foreach ($configs as $c) {
            SecretNumber::create([
                'grade' => $c['grade'],
                'level' => $c['level'],
                'group_number' => 1,
                'group_capacity' => $c['end'] - $c['start'] + 1,
                'academic_year' => $this->year,
                'language' => $c['lang'],
                'starts_at' => $c['start'],
                'ends_at' => $c['end'],
                'semester' => 'الأول',
            ]);
        }
    }

    private function createSeatNumbers(): void
    {
        $configs = [
            ['grade' => 1, 'lang' => 'عربي', 'level' => 'رياض أطفال', 'start' => 100001, 'end' => 100050],
            ['grade' => 3, 'lang' => 'عربي', 'level' => 'ابتدائي', 'start' => 200001, 'end' => 200050],
            ['grade' => 3, 'lang' => 'لغات', 'level' => 'ابتدائي', 'start' => 210001, 'end' => 210050],
            ['grade' => 5, 'lang' => 'عربي', 'level' => 'ابتدائي', 'start' => 300001, 'end' => 300050],
            ['grade' => 9, 'lang' => 'عربي', 'level' => 'اعدادي', 'start' => 400001, 'end' => 400050],
            ['grade' => 11, 'lang' => 'عربي', 'level' => 'اعدادي', 'start' => 500001, 'end' => 500050],
        ];

        foreach ($configs as $c) {
            SeatNumber::create([
                'grade' => $c['grade'],
                'level' => $c['level'],
                'academic_year' => $this->year,
                'language' => $c['lang'],
                'starts_at' => $c['start'],
                'ends_at' => $c['end'],
            ]);
        }
    }

    private function createExams(array $gradeSubjectMap): array
    {
        $examMap = [];

        foreach ($gradeSubjectMap as $gradeNum => $langs) {
            foreach ($langs as $lang => $subjects) {
                foreach ($subjects as $subjectName => $gsId) {
                    $gs = GradeSubject::find($gsId);
                    $totalMarks = $gs->total_marks;

                    $examId = DB::table('exams')->insertGetId([
                        'grade_subject_id' => $gsId,
                        'component_id' => 'final',
                        'academic_year' => $this->year,
                        'name' => 'الامتحان النهائي',
                        'date' => '2026-05-01 09:00:00',
                        'type' => 'امتحان',
                        'marks' => $totalMarks ?: 50,
                        'language' => $lang,
                        'semester' => 'الأول',
                        'duration_in_hours' => 2,
                    ]);

                    $examMap[$gradeNum][$lang][$subjectName] = $examId;
                }
            }
        }

        return $examMap;
    }

    private function createMarks(array $students, array $exams): void
    {
        $now = now();

        foreach ($students as $entry) {
            if ($entry['marks'] === null) {
                continue;
            }

            $grade = $entry['grade'];
            $lang = $entry['lang'];

            foreach ($entry['marks'] as $subjectName => $markValue) {
                $examId = $exams[$grade][$lang][$subjectName] ?? null;
                if (! $examId) {
                    continue;
                }

                DB::table('marks')->insert([
                    'student_id' => $entry['student']->id,
                    'exam_id' => $examId,
                    'marks' => $markValue,
                    'component_id' => 'final',
                    'academic_year' => $this->year,
                    'round' => 'first',
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
    }
}
