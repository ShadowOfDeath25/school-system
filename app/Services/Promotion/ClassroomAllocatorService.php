<?php

namespace App\Services\Promotion;

use App\Models\Classroom;
use App\Models\Student;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ClassroomAllocatorService
{
    public function allocate(Student $student, int $targetGrade, string $academicYear): Classroom
    {
        $level = app(PromotionEligibilityService::class)->levelForGrade($targetGrade);
        $language = $student->language;

        return $this->findOrCreateClassroom($targetGrade, $language, $level, $academicYear);
    }

    public function allocateBatch(
        Collection $students,
        int $targetGrade,
        string $academicYear,
        array $config = [],
        ?Collection $scores = null,
    ): array {
        $result = [];

        foreach ($students->groupBy('language') as $language => $languageStudents) {
            $level = app(PromotionEligibilityService::class)->levelForGrade($targetGrade);
            $classrooms = $this->availableClassrooms($targetGrade, $language, $level, $academicYear);
            $reservedSeats = [];
            $classroomLocks = $this->existingClassroomLocks($classrooms, $config);

            $genderGroups = ! empty($config['group_by_gender'])
                ? $languageStudents->groupBy('gender')
                : collect(['mixed' => $languageStudents]);

            foreach ($genderGroups as $gender => $genderStudents) {
                if ($genderStudents->isEmpty()) {
                    continue;
                }

                $sorted = $genderStudents
                    ->sortByDesc(fn (Student $student) => (float) ($scores?->get($student->id) ?? 0))
                    ->values();
                $baseGroup = ! empty($config['group_by_gender']) ? (string) $gender : 'mixed';
                $topCount = (int) ($config['top_student_count'] ?? 0);

                if ($topCount > 0) {
                    $result += $this->allocateStudentGroup(
                        $sorted->take($topCount),
                        $targetGrade,
                        $language,
                        $level,
                        $academicYear,
                        $baseGroup.':top',
                        $classrooms,
                        $reservedSeats,
                        $classroomLocks,
                    );

                    $result += $this->allocateStudentGroup(
                        $sorted->slice($topCount),
                        $targetGrade,
                        $language,
                        $level,
                        $academicYear,
                        $baseGroup.':regular',
                        $classrooms,
                        $reservedSeats,
                        $classroomLocks,
                    );
                } else {
                    $result += $this->allocateStudentGroup(
                        $sorted,
                        $targetGrade,
                        $language,
                        $level,
                        $academicYear,
                        $baseGroup,
                        $classrooms,
                        $reservedSeats,
                        $classroomLocks,
                    );
                }
            }
        }

        return $result;
    }

    private function allocateStudentGroup(
        Collection $students,
        int $targetGrade,
        string $language,
        string $level,
        string $academicYear,
        string $groupKey,
        Collection &$classrooms,
        array &$reservedSeats,
        array &$classroomLocks,
    ): array {
        $result = [];

        foreach ($students as $student) {
            $classroom = $classrooms->first(function (Classroom $classroom) use ($groupKey, $reservedSeats, $classroomLocks) {
                $lock = $classroomLocks[$classroom->id] ?? null;
                if ($lock !== null && $lock !== $groupKey) {
                    return false;
                }

                $plannedCount = (int) ($reservedSeats[$classroom->id] ?? 0);
                $occupiedCount = (int) ($classroom->students_count ?? 0);

                return $classroom->max_capacity === 0
                    || $occupiedCount + $plannedCount < $classroom->max_capacity;
            });

            if (! $classroom) {
                $classroom = $this->createClassroom($targetGrade, $language, $level, $academicYear);
                $classroom->setAttribute('students_count', 0);
                $classrooms->push($classroom);
            }

            $classroomLocks[$classroom->id] = $groupKey;
            $reservedSeats[$classroom->id] = ($reservedSeats[$classroom->id] ?? 0) + 1;
            $result[$student->id] = $classroom;
        }

        return $result;
    }

    private function availableClassrooms(
        int $grade,
        string $language,
        string $level,
        string $academicYear,
    ): Collection {
        return Classroom::where('grade', $grade)
            ->where('language', $language)
            ->where('level', $level)
            ->where('academic_year', $academicYear)
            ->with(['students:id,classroom_id,gender'])
            ->withCount(['students' => function ($query) {
                $query->where('withdrawn', false)->orWhereNull('withdrawn');
            }])
            ->get()
            ->filter(fn (Classroom $classroom) => $classroom->max_capacity === 0
                || $classroom->students_count < $classroom->max_capacity)
            ->sortBy('class_number')
            ->values();
    }

    private function existingClassroomLocks(Collection $classrooms, array $config): array
    {
        $locks = [];
        $separateByGender = ! empty($config['group_by_gender']);
        $separateTopStudents = ! empty($config['top_student_count']);

        foreach ($classrooms as $classroom) {
            if ((int) $classroom->students_count === 0) {
                continue;
            }

            if ($separateTopStudents) {
                $locks[$classroom->id] = 'occupied';

                continue;
            }

            if ($separateByGender) {
                $genders = $classroom->students->pluck('gender')->filter()->unique()->values();
                $locks[$classroom->id] = $genders->count() === 1
                    ? (string) $genders->first()
                    : 'mixed-existing';
            }
        }

        return $locks;
    }

    public function findOrCreateClassroom(int $grade, string $language, string $level, string $academicYear): Classroom
    {
        $classroom = $this->availableClassrooms($grade, $language, $level, $academicYear)->first();

        return $classroom ?? $this->createClassroom($grade, $language, $level, $academicYear);
    }

    private function createClassroom(int $grade, string $language, string $level, string $academicYear): Classroom
    {
        $maxClassNumber = Classroom::where('grade', $grade)
            ->where('language', $language)
            ->where('level', $level)
            ->where('academic_year', $academicYear)
            ->max('class_number') ?? 0;

        $capacity = Classroom::where('grade', $grade)
            ->where('language', $language)
            ->where('level', $level)
            ->value('max_capacity') ?? 30;

        return DB::transaction(function () use ($grade, $language, $level, $academicYear, $maxClassNumber, $capacity) {
            $classNumber = $maxClassNumber + 1;

            return Classroom::create([
                'grade' => $grade,
                'language' => $language,
                'level' => $level,
                'class_number' => $classNumber,
                'max_capacity' => $capacity,
                'actual_capacity' => $capacity,
                'academic_year' => $academicYear,
                'name' => $classNumber.'/'.getGradeNumber($grade).' '.$level,
            ]);
        });
    }
}
