# Student Promotion System — Implementation Plan

> Generated: 2026-07-08
> Status: Approved, awaiting implementation

---

## Overview

A comprehensive Student Promotion System for a Laravel 11 + React school management platform. Handles yearly promotion of students across grades 1-11 with pass/fail evaluation, complementary exams (دور ثاني), graduation, classroom allocation, and full rollback support.

---

## Phase 1: Database Migrations (4 migrations)

### Migration 1: Add `round` to `marks` table + update unique index

```php
// database/migrations/2026_07_08_000001_add_round_to_marks_table.php
Schema::table('marks', function (Blueprint $table) {
    $table->string('round')->default('first')->after('academic_year');
    $table->dropUnique(['student_id', 'exam_id', 'component_id']);
    $table->unique(['student_id', 'exam_id', 'component_id', 'round'], 'marks_student_exam_component_round_unique');
});
```

### Migration 2: Create `student_enrollments` table

```php
Schema::create('student_enrollments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('student_id')->constrained()->cascadeOnDelete();
    $table->integer('from_grade');
    $table->integer('to_grade')->nullable();
    $table->foreignId('from_classroom_id')->nullable()->constrained('classrooms')->nullOnDelete();
    $table->foreignId('to_classroom_id')->nullable()->constrained('classrooms')->nullOnDelete();
    $table->string('from_academic_year');
    $table->string('to_academic_year');
    $table->string('status'); // promoted, repeated, graduated, transferred
    $table->timestamp('enrolled_at');
    $table->timestamps();
});
```

### Migration 3: Create `promotion_batches` table

```php
Schema::create('promotion_batches', function (Blueprint $table) {
    $table->id();
    $table->string('from_academic_year');
    $table->string('to_academic_year');
    $table->integer('total_students')->default(0);
    $table->integer('promoted_count')->default(0);
    $table->integer('repeated_count')->default(0);
    $table->integer('graduated_count')->default(0);
    $table->string('status')->default('pending'); // pending, completed, rolled_back
    $table->foreignId('created_by')->constrained('users');
    $table->timestamp('rolled_back_at')->nullable();
    $table->foreignId('rolled_back_by')->nullable()->constrained('users');
    $table->timestamps();
});
```

### Migration 4: Create `promotion_batch_students` table

```php
Schema::create('promotion_batch_students', function (Blueprint $table) {
    $table->id();
    $table->foreignId('promotion_batch_id')->constrained()->cascadeOnDelete();
    $table->foreignId('student_id')->constrained()->cascadeOnDelete();
    $table->integer('from_grade');
    $table->integer('to_grade')->nullable();
    $table->foreignId('from_classroom_id')->nullable()->constrained('classrooms')->nullOnDelete();
    $table->foreignId('to_classroom_id')->nullable()->constrained('classrooms')->nullOnDelete();
    $table->string('decision'); // promoted, repeated, graduated, دور_ثاني
    $table->boolean('second_round_passed')->nullable();
    $table->boolean('rolled_back')->default(false);
    $table->text('notes')->nullable();
    $table->timestamps();
});
```

---

## Phase 2: Models (4 new + 1 modified)

### New: `App\Models\StudentEnrollment`
- Fillable: `student_id`, `from_grade`, `to_grade`, `from_classroom_id`, `to_classroom_id`, `from_academic_year`, `to_academic_year`, `status`, `enrolled_at`
- Relations: `student()`, `fromClassroom()`, `toClassroom()`
- Use `LogsActivityInArabic` trait

### New: `App\Models\PromotionBatch`
- Fillable: `from_academic_year`, `to_academic_year`, `total_students`, `promoted_count`, `repeated_count`, `graduated_count`, `status`, `created_by`, `rolled_back_at`, `rolled_back_by`
- Relations: `creator()`, `rollbacker()`, `batchStudents()`
- Scope: `pending()`, `completed()`, `rolledBack()`

### New: `App\Models\PromotionBatchStudent`
- Fillable: all columns from schema
- Relations: `batch()`, `student()`, `fromClassroom()`, `toClassroom()`

### Modified: `App\Models\Marks`
- Add `round` to `$fillable`
- Add `'round' => 'string'` to `$casts`

---

## Phase 3: Service Layer (5 services in `app/Services/Promotion/`)

### 1. `PromotionEligibilityService.php` — Core engine

```php
class PromotionEligibilityService
{
    public function evaluateStudent(Student $student, AcademicYear $fromYear): array
    // Returns: {student, subjects: Collection, category: string, details: array}

    public function getStudentMarksBySubject(Student $student, AcademicYear $year, string $round = 'first'): Collection
    // Aggregated marks per subject, grouped by grade_subject_id

    public function isSubjectPassed(Student $student, GradeSubject $gradeSubject, string $round = 'first'): bool
    // total marks >= GradeSubject.min_marks

    public function determineCategory(array $results): string
    // 'passed'|'دور_ثاني_eligible'|'repeat'|'graduated'

    public function preview(string $fromYear, int $grade, ?string $language): Collection
    // Preview eligibility for a group
}
```

**Key query:**
```sql
SELECT gs.id as grade_subject_id, SUM(m.marks) as total, gs.min_marks
FROM marks m
JOIN exams e ON m.exam_id = e.id
JOIN grade_subject gs ON e.grade_subject_id = gs.id
WHERE m.student_id = ? AND m.academic_year = ? AND m.round = ?
GROUP BY gs.id, gs.min_marks
```

### 2. `ClassroomAllocatorService.php`

```php
class ClassroomAllocatorService
{
    public function allocate(Student $student, int $targetGrade): Classroom
    // Find existing or create new, matching language + level

    public function findOrCreateClassroom(int $grade, string $language, string $level, string $academicYear): Classroom
}
```

**Level derivation:**
- Grades 1-2 → `'رياض أطفال'`
- Grades 3-8 → `'ابتدائي'`
- Grades 9-11 → `'اعدادي'`

### 3. `EnrollmentService.php`

```php
class EnrollmentService
{
    public function enrollStudent(Student $student, PromotionBatch $batch, string $decision, ?int $toGrade, ?Classroom $toClassroom, ?string $notes = null): StudentEnrollment

    public function updateStudentRecord(Student $student, ?int $newGrade, ?Classroom $classroom, ?string $status): void
}
```

### 4. `PromotionEngineService.php` — Orchestrator

```php
class PromotionEngineService
{
    public function __construct(
        private PromotionEligibilityService $eligibility,
        private ClassroomAllocatorService $allocator,
        private EnrollmentService $enrollment,
        private RollbackService $rollback
    ) {}

    public function preview(string $fromYear, int $grade, ?string $language): array

    public function execute(string $fromAcademicYear, string $toAcademicYear, ?array $studentIds = null, User $createdBy): PromotionBatch

    public function resolveSecondRound(PromotionBatch $batch, Student $student, array $subjectResults): void
}
```

### 5. `RollbackService.php`

```php
class RollbackService
{
    public function rollback(PromotionBatch $batch, User $rolledBackBy): void
    // Reverts student.grade, classroom_id, status
    // Marks enrollments + batch_students as rolled_back
    // Does NOT delete marks or classrooms
}
```

---

## Phase 4: Form Requests

All under `app/Http/Requests/Promotion/`:

| Request | Rules |
|---------|-------|
| `PreviewPromotionRequest` | `from_year:required,exists:academic_years,name`, `grade:required,integer,min:1,max:11`, `language:nullable,in:عربي,لغات` |
| `ExecutePromotionRequest` | `from_academic_year:required,exists:academic_years,name`, `to_academic_year:required,exists:academic_years,name|different:from_academic_year`, `student_ids:nullable,array`, `student_ids.*:exists:students,id` |
| `ResolveDorThaniRequest` | `promotion_batch_id:required,exists:promotion_batches,id`, `student_id:required,exists:promotion_batch_students,student_id`, `results:required,array|min:1`, `results.*.grade_subject_id:required,exists:grade_subject,id`, `results.*.passed:required,boolean` |
| `RollbackBatchRequest` | (route binding only) |

---

## Phase 5: Controller + API Routes

### `app/Http/Controllers/PromotionController.php`

```php
class PromotionController extends Controller
{
    public function __construct(private PromotionEngineService $engine, private RollbackService $rollback) {}

    public function preview(PreviewPromotionRequest $request): JsonResponse
    public function execute(ExecutePromotionRequest $request): JsonResponse
    public function resolveDorThani(ResolveDorThaniRequest $request): JsonResponse
    public function rollback(PromotionBatch $batch, Request $request): JsonResponse
    public function batches(Request $request): JsonResource
    public function showBatch(PromotionBatch $batch): JsonResource
}
```

### Routes (`routes/api.php` — inside `auth:sanctum` + `authorization`)

```php
Route::prefix('promotion')->name('promotion.')->group(function () {
    Route::get('preview', [PromotionController::class, 'preview'])->middleware('authorization:view promotion');
    Route::post('execute', [PromotionController::class, 'execute'])->middleware('authorization:create promotion');
    Route::post('dor-thani/resolve', [PromotionController::class, 'resolveDorThani'])->middleware('authorization:update promotion');
    Route::post('batches/{batch}/rollback', [PromotionController::class, 'rollback'])->middleware('authorization:delete promotion');
    Route::get('batches', [PromotionController::class, 'batches'])->middleware('authorization:view promotion');
    Route::get('batches/{batch}', [PromotionController::class, 'showBatch'])->middleware('authorization:view promotion');
});
```

---

## Phase 6: Frontend Components

### Route structure (`frontend/src/routes/promotion.jsx`):

```jsx
const routes = {
    path: "promotion",
    handle: { sidebar: { header: "النظام", name: "promotion" } },
    children: [
        { index: true, element: <PromotionDashboard />, handle: { sidebar: { title: "الترقية" }, action: "view promotion" } },
        { path: "batches", element: <BatchHistory />, handle: { sidebar: { title: "سجل الترقيات" }, action: "view promotion" } },
        { path: "graduation/:batchId", element: <GraduationReport />, handle: { sidebar: { title: "تقارير التخرج", hidden: true } } },
    ]
};
```

### Components:

| Component | Purpose |
|-----------|---------|
| `PromotionDashboard.jsx` | Year/grade/language selectors, preview button, stat cards |
| `EligibilityPreview.jsx` | Per-student table with pass/fail/دور ثاني/repeat/graduate columns |
| `DorThaniResolution.jsx` | Per-student: shows failed subjects with pass/fail toggles |
| `BatchHistory.jsx` | List of past batches with stats + rollback action |
| `GraduationReport.jsx` | Graduated students list with certificate generation |
| `PromotionExecutionModal.jsx` | Confirmation modal before executing promotion |

### Patterns to follow:

| Pattern | Source File |
|---------|-------------|
| `Page` wrapper + breadcrumbs | `Marks/RecordMarks/RecordMarks.jsx` |
| `axiosClient` for API calls | Same file |
| `useSnackbar` for notifications | Same file |
| `Table` for data grids | `Students/ViewStudents.jsx` |
| `ConfirmModal` for confirmations | `ui/ConfirmModal/ConfirmModal.jsx` |
| `SelectField` with options | `ui/SelectField/SelectField.jsx` |
| `StatCard` for stats | `ui/StatCard/StatCard.jsx` |
| Loading state with `LoadingScreen` | `Marks/RecordMarks/RecordMarks.jsx` |
| CSS modules per component | `RecordMarks/styles.module.css` |

---

## Phase 7: Test Plan (Pest/PHPUnit)

### Unit — PromotionEligibilityService
1. Student who passed all subjects → promoted
2. Student who failed 1 subject → دور ثاني eligible
3. Student who failed 3+ subjects → repeat
4. Grade 11 student who passed → graduated
5. Already graduated/withdrawn students excluded
6. Student with no marks → repeat
7. Subject with no exams → auto-pass

### Unit — ClassroomAllocatorService
8. Allocate to existing classroom with capacity
9. Create new classroom when all full
10. Create first classroom when none exist
11. Match language + level correctly

### Integration — PromotionEngineService
12. Full batch with mixed results
13. Enrollment records created correctly
14. Student grade/classroom updated
15. Duplicate batch prevention
16. Second-round: all passed → promoted
17. Second-round: still failed → repeat

### Rollback tests
18. Full batch rollback reverses correctly
19. Graduated status reverted to active
20. Marks and classrooms preserved after rollback

---

## File Creation Summary

| # | File | Type |
|---|------|------|
| 1 | `database/migrations/..._add_round_to_marks_table.php` | Migration |
| 2 | `database/migrations/..._create_student_enrollments_table.php` | Migration |
| 3 | `database/migrations/..._create_promotion_batches_table.php` | Migration |
| 4 | `database/migrations/..._create_promotion_batch_students_table.php` | Migration |
| 5 | `app/Models/StudentEnrollment.php` | Model |
| 6 | `app/Models/PromotionBatch.php` | Model |
| 7 | `app/Models/PromotionBatchStudent.php` | Model |
| 8 | `app/Services/Promotion/PromotionEligibilityService.php` | Service |
| 9 | `app/Services/Promotion/ClassroomAllocatorService.php` | Service |
| 10 | `app/Services/Promotion/EnrollmentService.php` | Service |
| 11 | `app/Services/Promotion/PromotionEngineService.php` | Service |
| 12 | `app/Services/Promotion/RollbackService.php` | Service |
| 13 | `app/Http/Controllers/PromotionController.php` | Controller |
| 14 | `app/Http/Requests/Promotion/PreviewPromotionRequest.php` | Form Request |
| 15 | `app/Http/Requests/Promotion/ExecutePromotionRequest.php` | Form Request |
| 16 | `app/Http/Requests/Promotion/ResolveDorThaniRequest.php` | Form Request |
| 17 | `app/Http/Resources/PromotionBatchResource.php` | Resource |
| 18 | `app/Http/Resources/PromotionBatchStudentResource.php` | Resource |
| 19 | `frontend/src/routes/promotion.jsx` | Route |
| 20 | `frontend/src/components/pages/PromoteStudents/PromotionDashboard.jsx` | Component |
| 21 | `frontend/src/components/pages/PromoteStudents/EligibilityPreview.jsx` | Component |
| 22 | `frontend/src/components/pages/PromoteStudents/DorThaniResolution.jsx` | Component |
| 23 | `frontend/src/components/pages/PromoteStudents/BatchHistory.jsx` | Component |
| 24 | `frontend/src/components/pages/PromoteStudents/GraduationReport.jsx` | Component |
| 25 | `frontend/src/components/pages/PromoteStudents/PromotionExecutionModal.jsx` | Component |
| 26 | `frontend/src/components/pages/PromoteStudents/styles.module.css` | Styles |

### Existing files to modify:
- `app/Models/Marks.php` — add `round` to fillable + casts
- `routes/api.php` — add promotion route group
- `frontend/src/routes/routes.jsx` — import and register `promotionRoutes`

---

## Edge Case Catalog

1. Already graduated/withdrawn — excluded from eligibility
2. No marks at all — defaults to repeat
3. Subject with no exams — auto-pass or flag
4. Duplicate second-round marks — unique constraint on (student_id, exam_id, component_id, round)
5. Batch partial failure — entire batch rolls back in DB transaction
6. Student changes language — flagged for manual handling
7. No classroom for target grade/lang/level — auto-created with class_number=1
8. Classroom max_capacity = 0 — treated as unlimited
9. Mixed-level classroom — allocate to correct level
10. Non-consecutive grade jump — validated by the system
11. HasSiblings attribute — not promotion-relevant
12. Secret/seat assignments from previous year — expired on promotion
13. Concurrent promotion runs — locked at from_year/to_year pair
14. Partially passed second round — must pass ALL retaken subjects to promote
