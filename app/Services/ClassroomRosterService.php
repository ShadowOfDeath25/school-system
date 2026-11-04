<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Classroom;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

class ClassroomRosterService
{
    /**
     * Get classrooms with their students formatted for roster reporting.
     *
     * @return Collection<int, array{
     *     classroom: Classroom,
     *     students: Collection<int, array<string, mixed>>,
     *     students_count: int,
     *     male_count: int,
     *     female_count: int,
     *     muslim_count: int,
     *     christian_count: int
     * }>
     */
    public function getData(
        string $academicYear,
        ?string $language = null,
        ?string $level = null,
        ?int $grade = null,
        ?int $classroomId = null,
        ?string $status = null,
        ?string $religion = null,
        ?string $gender = null,
        ?string $noteFilter = null,
        ?string $sorting = null,
    ): Collection {
        $parts = explode('-', str_replace(' ', '', $academicYear));
        $startYear = (int) ($parts[0] ?? date('Y'));
        $referenceDate = Carbon::create($startYear, 10, 1);

        $classroomQuery = Classroom::query()
            ->where('academic_year', $academicYear)
            ->when($language, fn ($q) => $q->where('language', $language))
            ->when($level, fn ($q) => $q->where('level', $level))
            ->when($grade, fn ($q) => $q->where('grade', $grade))
            ->when($classroomId, fn ($q) => $q->where('id', $classroomId))
            ->orderByRaw("CASE
                WHEN level = 'رياض أطفال' THEN 1
                WHEN level = 'ابتدائي' THEN 2
                WHEN level = 'اعدادي' THEN 3
                ELSE 4
            END")
            ->orderByRaw('CAST(grade AS UNSIGNED)')
            ->orderBy('class_number');

        $classroomQuery->with(['students' => function (HasMany $query) use ($status, $religion, $gender, $noteFilter, $sorting) {
            $query->with(['parents', 'guardian'])
                ->where(function ($q) {
                    $q->where('withdrawn', false)->orWhereNull('withdrawn');
                })
                ->where(function ($q) {
                    $q->where('transferred_out', false)->orWhereNull('transferred_out');
                })
                ->where(function ($q) {
                    $q->where('status', '!=', 'متخرج')->orWhereNull('status');
                })
                ->when($status, fn ($q) => $q->where('status', $status))
                ->when($religion, fn ($q) => $q->where('religion', $religion))
                ->when($gender, fn ($q) => $q->where('gender', $gender))
                ->when($noteFilter, function ($q) use ($noteFilter) {
                    if ($noteFilter === 'لا يوجد') {
                        $q->where(fn ($sub) => $sub->whereNull('note')->orWhere('note', ''));
                    } else {
                        $q->where('note', $noteFilter);
                    }
                });

            if ($sorting === 'maleFirst') {
                $query->orderBy('gender', 'asc')->orderBy('name_in_arabic', 'asc');
            } elseif ($sorting === 'femaleFirst') {
                $query->orderBy('gender', 'desc')->orderBy('name_in_arabic', 'asc');
            } else {
                $query->orderBy('name_in_arabic', 'asc');
            }
        }]);

        $classrooms = $classroomQuery->get();

        return $classrooms->map(function (Classroom $classroom) use ($referenceDate) {
            $formattedStudents = $classroom->students->map(function (Student $student) use ($referenceDate) {
                $birthDate = $student->birth_date ? Carbon::parse($student->birth_date) : null;
                $ageDiff = $birthDate ? $referenceDate->diff($birthDate) : null;
                $guardian = $student->guardian;

                return [
                    'id' => $student->id,
                    'reg_number' => $student->reg_number,
                    'name_in_arabic' => $student->full_name,
                    'name_in_english' => $student->name_in_english,
                    'nid' => $student->nid,
                    'gender' => $student->gender === 'male' ? 'ذكر' : ($student->gender === 'female' ? 'أنثى' : $student->gender),
                    'religion' => $student->religion,
                    'status' => $student->status,
                    'birth_date_display' => $birthDate ? $birthDate->format('d/m/Y') : '—',
                    'age_display' => $ageDiff ? "{$ageDiff->y}س {$ageDiff->m}ش {$ageDiff->d}ي" : '—',
                    'guardian_name' => $guardian?->name ?? '—',
                    'guardian_phone' => $guardian?->phone_number ?? '—',
                    'note' => $student->note ?? '',
                ];
            });

            return [
                'classroom' => $classroom,
                'students' => $formattedStudents,
                'students_count' => $formattedStudents->count(),
                'male_count' => $classroom->students->where('gender', 'male')->count(),
                'female_count' => $classroom->students->where('gender', 'female')->count(),
                'muslim_count' => $classroom->students->where('religion', 'مسلم')->count(),
                'christian_count' => $classroom->students->where('religion', 'مسيحي')->count(),
            ];
        });
    }
}
