<?php

namespace App\Services;

use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class StudentRosterService
{
    public function getRoster(
        string $academicYear,
        ?string $status = null,
        ?string $religion = null,
        ?string $gender = null,
        ?string $language = null,
        ?string $level = null,
        ?int $grade = null,
        ?int $classroom = null,
        ?string $search = null,
        string $sortBy = 'name_in_arabic',
        string $sortDir = 'asc',
        int $perPage = 30,
        int $page = 1,
        ?string $noteFilter = null,
    ): array {

        $academicYearParts = explode(' - ', $academicYear);
        $startYear = (int) trim($academicYearParts[0]);
        $referenceDate = Carbon::create($startYear, 10, 1);

        $query = Student::with(['guardians' => function ($q) {
            $q->select('guardians.id', 'guardians.name', 'guardians.job', 'guardians.phone_number');
        }])->with('classroom:id,name,level,grade,language');

        $query->whereHas('classroom', function ($q) use ($academicYear) {
            $q->where('academic_year', $academicYear);
        });

        if ($status) {
            $query->where('status', $status);
        }

        if ($religion) {
            $query->where('religion', $religion);
        }

        if ($gender) {
            $query->where('gender', $gender);
        }

        if ($language) {
            $query->where('language', $language);
        }

        if ($level) {
            $query->whereHas('classroom', fn ($q) => $q->where('level', $level));
        }

        if ($grade) {
            $query->where('grade', $grade);
        }

        if ($classroom) {
            $query->where('classroom_id', $classroom);
        }

        if ($noteFilter) {
            if ($noteFilter === 'لا يوجد') {
                $query->where(function ($q) {
                    $q->whereNull('note')->orWhere('note', '');
                });
            } else {
                $query->where('note', $noteFilter);
            }
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name_in_arabic', 'like', "%{$search}%")
                    ->orWhere('nid', 'like', "%{$search}%")
                    ->orWhere('reg_number', 'like', "%{$search}%");
            });
        }

        $query->orderBy($sortBy, $sortDir);

        $total = $query->count();
        $students = $query->skip(($page - 1) * $perPage)->take($perPage)->get();

        $rows = $students->map(function ($student) use ($referenceDate) {
            return $this->formatStudentRow($student, $referenceDate);
        });

        $summary = $this->getSummary($academicYear, $status, $religion, $gender, $language, $level, $grade, $classroom, $noteFilter);

        return [
            'data' => $rows,
            'summary' => $summary,
            'meta' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'last_page' => max((int) ceil($total / $perPage), 1),
            ],
        ];
    }

    public function getAllRosterRows(
        string $academicYear,
        ?string $status = null,
        ?string $religion = null,
        ?string $gender = null,
        ?string $language = null,
        ?string $level = null,
        ?int $grade = null,
        ?int $classroom = null,
        ?string $search = null,
        string $sortBy = 'name_in_arabic',
        string $sortDir = 'asc',
        ?string $noteFilter = null,
    ): Collection {
        $academicYearParts = explode(' - ', $academicYear);
        $startYear = (int) trim($academicYearParts[0]);
        $referenceDate = Carbon::create($startYear, 10, 1);

        $query = Student::with(['guardians' => function ($q) {
            $q->select('guardians.id', 'guardians.name', 'guardians.job', 'guardians.phone_number');
        }])->with('classroom:id,name,level,grade,language');

        $query->whereHas('classroom', function ($q) use ($academicYear) {
            $q->where('academic_year', $academicYear);
        });

        if ($status) {
            $query->where('status', $status);
        }
        if ($religion) {
            $query->where('religion', $religion);
        }
        if ($gender) {
            $query->where('gender', $gender);
        }
        if ($language) {
            $query->where('language', $language);
        }
        if ($level) {
            $query->whereHas('classroom', fn ($q) => $q->where('level', $level));
        }
        if ($grade) {
            $query->where('grade', $grade);
        }
        if ($classroom) {
            $query->where('classroom_id', $classroom);
        }
        if ($noteFilter) {
            if ($noteFilter === 'لا يوجد') {
                $query->where(function ($q) {
                    $q->whereNull('note')->orWhere('note', '');
                });
            } else {
                $query->where('note', $noteFilter);
            }
        }
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name_in_arabic', 'like', "%{$search}%")
                    ->orWhere('nid', 'like', "%{$search}%")
                    ->orWhere('reg_number', 'like', "%{$search}%");
            });
        }

        $query->orderBy($sortBy, $sortDir);

        return $query->get()->map(function ($student) use ($referenceDate) {
            return $this->formatStudentRow($student, $referenceDate);
        });
    }

    private function formatStudentRow(Student $student, Carbon $referenceDate): array
    {
        $birthDate = Carbon::parse($student->birth_date);
        $ageDiff = $referenceDate->diff($birthDate);
        $guardian = $student->guardians->first();

        return [
            'id' => $student->id,
            'reg_number' => $student->reg_number,
            'name_in_arabic' => $student->name_in_arabic,
            'name_in_english' => $student->name_in_english,
            'nid' => $student->nid,
            'gender' => $student->gender,
            'religion' => $student->religion,
            'nationality' => $student->nationality,
            'status' => $student->status,
            'birth_date' => $birthDate->format('Y-m-d'),
            'birth_date_display' => $birthDate->format('d/m/Y'),
            'entry_date' => $student->created_at?->format('Y/m/d'),
            'age_years' => $ageDiff->y,
            'age_months' => $ageDiff->m,
            'age_days' => $ageDiff->d,
            'age_display' => "{$ageDiff->y}س {$ageDiff->m}ش {$ageDiff->d}ي",
            'guardian_name' => $guardian?->name,
            'guardian_job' => $guardian?->job,
            'guardian_phone' => $guardian?->phone_number,
            'classroom_name' => $student->classroom?->name,
            'classroom_level' => $student->classroom?->level,
            'classroom_grade' => $student->classroom?->grade,
            'language' => $student->language,
        ];
    }

    private function getSummary(
        string $academicYear,
        ?string $status,
        ?string $religion,
        ?string $gender,
        ?string $language,
        ?string $level,
        ?int $grade,
        ?int $classroom,
        ?string $noteFilter = null,
    ): array {
        $query = Student::whereHas('classroom', function ($q) use ($academicYear) {
            $q->where('academic_year', $academicYear);
        });

        if ($status) {
            $query->where('status', $status);
        }
        if ($religion) {
            $query->where('religion', $religion);
        }
        if ($gender) {
            $query->where('gender', $gender);
        }
        if ($language) {
            $query->where('language', $language);
        }
        if ($level) {
            $query->whereHas('classroom', fn ($q) => $q->where('level', $level));
        }
        if ($grade) {
            $query->where('grade', $grade);
        }
        if ($classroom) {
            $query->where('classroom_id', $classroom);
        }
        if ($noteFilter) {
            if ($noteFilter === 'لا يوجد') {
                $query->where(function ($q) {
                    $q->whereNull('note')->orWhere('note', '');
                });
            } else {
                $query->where('note', $noteFilter);
            }
        }

        $allStudents = $query->get(['id', 'gender', 'religion', 'status']);

        return [
            'total' => $allStudents->count(),
            'male_count' => $allStudents->where('gender', 'male')->count(),
            'female_count' => $allStudents->where('gender', 'female')->count(),
            'muslim_count' => $allStudents->where('religion', 'مسلم')->count(),
            'christian_count' => $allStudents->where('religion', 'مسيحي')->count(),
            'new_count' => $allStudents->where('status', 'مستجد')->count(),
            'registered_count' => $allStudents->where('status', 'مقيد')->count(),
        ];
    }
}
