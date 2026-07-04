# Student Promotion Feature Implementation Plan

## Feature Understanding

- The system is an existing Laravel backend with a React/Vite frontend.
- Students currently store current placement directly on the students table: classroom_id, grade, level, language, status, and withdrawn.
- Academic year is inferred through the current classroom: students.classroom_id to classrooms.academic_year.
- Classrooms store academic_year as a string and are filtered by academic year, language, level, grade, and class number.
- Grades are numeric from 1 to 11.
- Exams and marks already exist through grade_subject, exams, and exam_student.
- grade_subject stores min_marks, component marks, and reporting flags.
- exams belong to grade_subject and an academic year.
- exam_student stores student marks per exam.
- The frontend already has a partial promotion area under frontend/src/components/pages/PromoteStudents, but it is incomplete.
- There is no backend promotion engine, promotion history, enrollment history, rollback logic, or duplicate-promotion protection.
- Authorization uses Spatie permissions through the custom authorization middleware.
- Frontend route visibility uses route handle.action with ProtectedRoute.
- UI patterns use React Query, MUI, and custom Page, Table, Filters, InputModal, ConfirmModal, and Snackbar components.

## Confirmed Business Rules

- A student passes a subject when total marks for that subject meet or exceed grade_subject.min_marks.
- Promotion is based on subject-level pass/fail evaluation.
- Marks recording is a separate procedure from promotion.
- Promotion consumes already recorded marks only and must not save marks.
- Missing or incomplete marks must be shown clearly in promotion preview.
- If marks are missing, the admin can leave promotion and complete marks recording first, or manually decide to promote, block, or exclude the student.
- Failed/repeating students move to the new academic year but remain in the same grade progression.
- Passed students move to the next grade in the new academic year.
- Students after grade 11 become graduated.
- Withdrawn students are excluded from promotion because they are no longer in the school.
- Target classrooms are auto-assigned by class number first, then remaining capacity. Example: students in 2/1 promote to 3/1, and overflow moves to 3/2, then the next available class by class_number.
- The UI must warn the admin before creating a new academic year.
- Student status values should be standardized as part of this feature.
- Rollback is allowed only if no new target-year dependent records exist for the promoted students.
- Rollback is blocked if target-year records exist for the students, including payments, extra dues, exemptions, book purchases, uniform purchases, exam marks, seat numbers, secret numbers, or other academic-year-specific records.

## Assumptions

- Existing current-placement fields on students remain for compatibility with existing screens.
- A new enrollment/history table becomes the source of historical placement data.
- The promotion engine updates current student fields only after recording enrollment and promotion batch history.
- Existing tables are modified only by editing their original migration files, per project rule.
- New migrations are created only for completely new tables.

## Open Questions

- Should graduation create a final enrollment record for the target academic year, or only mark the student status as graduated?
- Should graduated students keep their last classroom assignment or have classroom_id set to null?
- Should rollback be allowed for graduation batches using the same dependency checks?
- Should auto-created academic years be activated automatically, or only created and left inactive?
- Should failed students be assigned to the same class number in the same grade for the new academic year, with overflow handled by capacity?

## Gap Analysis

### Existing Functionality

- Student CRUD and classroom assignment.
- Classroom CRUD and filtering.
- Academic year CRUD and activation.
- Exam CRUD.
- Student exam mark storage.
- Grade-subject pass mark configuration.
- Basic activity logging.
- Role/permission authorization.
- Partial frontend promotion route.
- Existing mark storage through exam_student.

### Missing Functionality

- Historical enrollments.
- Promotion batches.
- Per-student promotion decisions.
- Promotion preview and execution.
- Rollback.
- Duplicate promotion prevention.
- Automatic target classroom allocation.
- Graduation handling.
- Standardized student statuses.
- Complete standalone marks-recording workflow.
- Arabic promotion-specific UI states and validation messages.

### Required Changes

- Add new domain tables: student_enrollments, promotion_batches, and promotion_batch_students.
- Modify original existing migrations where existing tables need constraints or indexes.
- Add promotion models, services, requests, resources, and controller.
- Add promotion routes and permissions.
- Replace incomplete promotion frontend with a complete promotion workflow.
- Build or finish a separate marks-recording procedure.
- Add tests for marks recording, promotion, and rollback.

## Proposed Architecture

### Backend Promotion Flow

1. Select source academic year and classroom.
2. Load non-withdrawn students.
3. Load required exams and existing marks.
4. Calculate subject-level pass/fail status.
5. Show missing marks and pass/fail summary.
6. Let admin override final promotion decision when marks are incomplete or when an administrative decision is needed.
7. Preview target classroom assignment.
8. Confirm and execute inside a database transaction.
9. Record promotion batch and per-student promotion rows.
10. Create target-year enrollment rows.
11. Update current student placement/status.
12. Audit the operation.

### Separate Marks Recording Flow

1. Select academic year, level, grade, language, and classroom.
2. Select exam or subject/component view.
3. Load students.
4. Record or update marks.
5. Validate marks against exam maximum marks.
6. Save marks through ExamStudentController or a dedicated marks controller.
7. Return to promotion preview after marks are complete.

Promotion endpoints must never write exam marks.

### Backend New Components

- app/Models/StudentEnrollment.php
- app/Models/PromotionBatch.php
- app/Models/PromotionBatchStudent.php
- app/Http/Controllers/PromotionController.php
- app/Http/Requests/Promotion/PreviewPromotionRequest.php
- app/Http/Requests/Promotion/StorePromotionBatchRequest.php
- app/Http/Requests/Promotion/RollbackPromotionBatchRequest.php
- app/Http/Resources/PromotionPreviewResource.php
- app/Http/Resources/PromotionBatchResource.php
- app/Http/Resources/PromotionBatchStudentResource.php
- app/Services/StudentPromotionService.php
- app/Services/StudentPromotionEligibilityService.php
- app/Services/StudentPromotionClassroomAllocator.php
- app/Services/StudentPromotionRollbackService.php
- app/Services/StudentEnrollmentService.php

### Backend Modified Components

- routes/api.php
- app/Models/Student.php
- app/Models/Classroom.php
- app/Models/AcademicYear.php
- app/Models/ExamStudent.php
- app/Http/Controllers/ExamStudentController.php, for standalone marks recording only
- app/Http/Requests/Student/StoreStudentMarkRequest.php, for standalone marks validation only
- database/factories/PermissionFactory.php
- lang/ar/activitylog.php
- database/migrations/2026_03_29_092203_create_exam_student_table.php
- database/migrations/12_2025_08_16_195429_create_students_table.php, only if status/index changes are needed

## Database Design

### student_enrollments

Purpose: preserve historical academic placement.

Fields:

- id
- student_id
- academic_year
- classroom_id
- grade
- level
- language
- status
- started_at
- ended_at
- is_current
- promotion_batch_id, nullable
- notes, nullable
- timestamps

Constraints and indexes:

- unique active/current enrollment per student.
- unique student enrollment per academic year unless future business rules allow multiple.
- index student_id, academic_year, classroom_id, and is_current.

Relationships:

- Student hasMany StudentEnrollment.
- Student hasOne currentEnrollment.
- Classroom hasMany StudentEnrollment.
- PromotionBatch hasMany StudentEnrollment.

### promotion_batches

Purpose: record one promotion operation.

Fields:

- id
- source_academic_year
- target_academic_year
- source_classroom_id, nullable for multi-class batches
- status: draft, completed, rolled_back
- created_by
- completed_at
- rolled_back_at
- rolled_back_by, nullable
- rollback_reason, nullable
- metadata, json nullable
- timestamps

Indexes: source_academic_year, target_academic_year, source_classroom_id, status, created_by.

### promotion_batch_students

Purpose: record each student promotion decision and result.

Fields:

- id
- promotion_batch_id
- student_id
- source_enrollment_id, nullable
- target_enrollment_id, nullable
- from_classroom_id
- to_classroom_id, nullable for graduated/excluded
- from_grade
- to_grade, nullable for graduated
- from_level
- to_level, nullable for graduated
- decision: promote, repeat, exclude, graduate
- academic_result: passed, failed, incomplete, manual
- status: pending, completed, rolled_back, blocked
- subject_results, json
- warnings, json nullable
- manual_override, boolean
- notes, nullable
- timestamps

Constraints and indexes:

- unique promotion_batch_id plus student_id.
- unique student promotion per source_academic_year and target_academic_year through validation and/or stored columns.
- index decision and status.

### Existing Table Changes

exam_student:

- Add unique index on student_id plus exam_id.
- Reason: prevent duplicate marks for the same student and exam.
- Modify original migration database/migrations/2026_03_29_092203_create_exam_student_table.php.

students:

- Consider standardizing status values and adding an index if needed.
- Do not add a new migration for this table. Modify database/migrations/12_2025_08_16_195429_create_students_table.php if required.

## Frontend Architecture

### Promotion Components

- frontend/src/components/pages/PromoteStudents/PromoteStudents.jsx
- frontend/src/components/pages/PromoteStudents/PromotionWizard.jsx
- frontend/src/components/pages/PromoteStudents/PromotionFilters.jsx
- frontend/src/components/pages/PromoteStudents/PromotionReviewTable.jsx
- frontend/src/components/pages/PromoteStudents/PromotionSummary.jsx
- frontend/src/components/pages/PromoteStudents/PromotionConfirmation.jsx
- frontend/src/components/pages/PromoteStudents/PromotionBatchDetails.jsx
- frontend/src/hooks/api/usePromotions.js

### Standalone Marks Components

- frontend/src/components/pages/StudentMarks/StudentMarksProcedure.jsx
- frontend/src/components/pages/StudentMarks/StudentMarksClassroomPicker.jsx
- frontend/src/components/pages/StudentMarks/StudentMarksTable.jsx
- frontend/src/hooks/api/useStudentMarks.js

### Modified Frontend Files

- frontend/src/components/pages/PromoteStudents/PromoteStudents.jsx
- frontend/src/components/pages/PromoteStudents/StudentPicker.jsx, remove or repurpose
- frontend/src/components/pages/PromoteStudents/StudentMarks.jsx, remove from promotion flow or move to standalone marks area
- frontend/src/routes/students.jsx
- frontend/src/translation/ar.json
- frontend/src/components/ui/Sidebar/sidebarItems.js, only if sidebar items are manually maintained there

### Promotion UI Flow

1. Choose source academic year.
2. Choose target academic year.
3. If target academic year does not exist, show a warning before creation.
4. Choose source level, grade, language, and classroom.
5. Load students and required marks.
6. Show subject-level pass/fail result for each student.
7. Show warnings for incomplete marks with a link/action to the separate marks-recording procedure.
8. Let admin choose per-student action: promote, repeat, exclude, or graduate.
9. Preview automatic target classroom allocation.
10. Show summary: promoted, repeated, excluded, graduated, capacity warnings, and missing marks warnings.
11. Confirm execution.
12. Show success or error state.

### Standalone Marks UI Flow

1. Choose academic year.
2. Choose level, grade, language, and classroom.
3. Choose exam or subject/component view.
4. Load students in the selected classroom.
5. Record or update marks.
6. Validate marks against exam maximum marks.
7. Save marks.
8. Return to promotion preview when needed.

## Phase 1 - Discovery and Validation

### Objectives

- Convert confirmed business rules into exact technical rules.
- Verify all affected current flows before coding.
- Ensure existing data can be safely migrated into enrollment history.
- Define standalone marks-recording workflow boundaries.

### Backend Tasks

- Confirm exact status values to standardize.
- Decide whether status values are stored as Arabic strings or internal enum-like values with Arabic labels.
- Trace existing reads of students.status, students.classroom_id, students.grade, students.level, and students.language.
- Trace academic-year-specific tables used in rollback checks.
- Define exact graduation behavior for grade 11.
- Define target-year classroom requirements.
- Define backfill rules for existing students.
- Confirm whether marks recording continues through ExamStudentController or moves to a dedicated marks controller.

### Frontend Tasks

- Identify where current promotion and marks routes appear in sidebar.
- Confirm promotion route permission should become create promotions.
- Confirm marks route permission should use create exam-students or a dedicated marks permission.
- Confirm all visible text is Arabic.
- Confirm existing Page, Table, Filters, ConfirmModal, and Snackbar patterns can support both workflows.

### Deliverables

- Final status value list.
- Graduation behavior decision.
- Backfill strategy.
- Confirmed promotion API contract.
- Confirmed standalone marks API/UI contract.

### Risks

- Existing mojibake Arabic strings can cause inconsistent UI labels.
- Existing data may contain non-standard status values.

## Phase 2 - Database and Domain Preparation

### Objectives

- Add durable history and promotion tracking.
- Preserve existing current-state behavior.
- Prevent duplicate marks and duplicate promotions.

### Backend Tasks

- Create migration for student_enrollments.
- Create migration for promotion_batches.
- Create migration for promotion_batch_students.
- Modify original exam_student migration to add unique student_id plus exam_id.
- Modify original students migration only if adding status indexes or status constraints.
- Add new Eloquent models and relationships.
- Add casts for metadata, subject_results, and warnings.
- Add factory support if tests need it.
- Add a command or controlled service method to backfill current enrollments from current student/classroom data.

### Frontend Tasks

- None required in this phase.

### Deliverables

- New schema.
- New models.
- Backfill plan/command.
- Documented affected tables, relationships, and models.

### Risks

- Backfilling students without classrooms needs a clear rule.
- Unique enrollment constraints may fail if existing data contains duplicated academic-year placement.

## Phase 3 - Promotion Engine

### Objectives

- Build backend promotion preview, eligibility calculation, execution, and rollback.
- Keep marks recording as a separate procedure that promotion only reads from.

### Backend Tasks

- Create StudentPromotionEligibilityService.
- Load grade subjects for each student grade/language.
- Load exams for the source academic year.
- Load existing student marks.
- Aggregate marks per subject.
- Compare subject total to min_marks.
- Return subject results with required marks, actual marks, pass/fail/incomplete state, and missing exams/components.
- Create StudentPromotionClassroomAllocator.
- For passed students, target grade is current grade plus 1.
- For failed/repeating students, target grade is current grade.
- For grade 11 passed students, decision is graduation.
- Match target classroom by target academic year, target grade, target level, language, and preferred class number from source classroom.
- Fill preferred class first, then overflow by ascending class_number.
- Block if total target capacity is insufficient.
- Create StudentPromotionService with DB transaction, row locking, batch creation, enrollment changes, and current student updates.
- Create StudentPromotionRollbackService with dependency checks and DB transaction.
- Add promotion API endpoints.
- Add request validation classes and resources.
- Add explicit permissions: view promotions, create promotions, rollback promotions.

### Frontend Tasks

- Add usePromotions.js hooks.
- Do not call generic students update endpoints for promotion.
- Do not save marks from the promotion flow.

### Deliverables

- Promotion preview endpoint.
- Promotion execution endpoint.
- Rollback endpoint.
- Permission integration.
- Backend tests for services and endpoints.

### Risks

- Race conditions during classroom capacity allocation.
- Duplicate promotion attempts from multiple browser sessions.
- Manual override requires clear audit metadata.

## Phase 4 - User Interface

### Objectives

- Deliver complete Arabic promotion workflow matching existing UI.
- Deliver or finish standalone Arabic marks-recording workflow.

### Backend Tasks

- Adjust promotion preview response shape as needed by the UI.
- Ensure promotion validation errors are suitable for Arabic display.
- Ensure marks validation errors are suitable for Arabic display.

### Frontend Tasks

- Replace PromoteStudents.jsx with the main promotion workflow.
- Remove marks entry from the promotion confirmation flow.
- Add links/actions from missing-mark warnings to the standalone marks procedure.
- Add promotion filters: source academic year, target academic year, language, level, grade, classroom.
- Add academic year creation warning when the target year does not exist.
- Add review table with student name, registration number, current classroom, academic result, missing marks warning, recommended decision, editable final decision, and target classroom.
- Add confirmation summary.
- Add rollback view/action on completed promotion batches.
- Build standalone marks UI with classroom picker, exam/component selection, student marks table, validation, loading, empty, success, and error states.
- Use existing loading, empty, success, and error patterns.
- Use existing permission-driven route visibility.

### Deliverables

- Complete promotion workflow.
- Standalone marks-recording workflow.
- Batch review UI.
- Rollback UI.

### Risks

- Promotion tables may become wide; table layout needs careful responsive handling.
- Manual override must be visually obvious to prevent accidental promotion.
- The marks flow must feel connected enough for admins to move between marks and promotion without mixing responsibilities.

## Phase 5 - Validation and Safeguards

### Objectives

- Prevent data corruption, duplicate promotion, duplicate marks, and unsafe rollback.

### Backend Tasks

- Validate preview requests: source year exists, target year exists or creation confirmed, source classroom belongs to source year, and source classroom contains eligible non-withdrawn students.
- Validate execution requests: student belongs to source classroom/year, student is not withdrawn, student has not already been promoted from source year to target year, target classroom matches decision, capacity is enough, grade 11 does not promote to grade 12, failed students repeat same grade, manual override is stored.
- Validate marks in the standalone marks procedure: no duplicate marks for same student/exam, marks cannot exceed exam marks, exam must belong to student grade/language.
- Validate rollback: batch is completed, batch is not rolled back, no target-year dependent records exist, affected students still match batch target state.
- Add activity logs for batch completed, batch rolled back, manual override used, and marks recorded/updated if not already logged.

### Frontend Tasks

- Disable final promotion confirmation when blocking errors exist.
- Show warnings but allow manual action for incomplete marks.
- Require confirmation before creating new academic year, executing promotion, and rolling back promotion.
- Show row-level validation messages.
- Keep marks save errors inside the standalone marks workflow.

### Deliverables

- Strong backend invariants.
- Clear Arabic UI safeguards.

### Risks

- Rollback could become unsafe if future year-specific tables are added without updating dependency checks.

## Phase 6 - Testing and Rollout

### Objectives

- Verify all scenarios and deploy safely.

### Backend Tasks

- Add tests for subject pass based on min_marks, failed subject result, missing marks with manual promote/block, passed promotion, failed repeat, mixed batch, withdrawn exclusion, grade 11 graduation, class-number preference, capacity overflow, capacity shortage, duplicate promotion prevention, rollback success, rollback blocked by target-year payments, and rollback blocked by target-year exam marks.
- Add tests for standalone marks recording.
- Add tests for unique exam_student behavior.
- Add tests for authorization.

### Frontend Tasks

- Run lint/build.
- Manually test empty state, loading state, validation errors, missing marks, manual override, capacity overflow, graduation, rollback blocked/success, and standalone marks recording.
- Verify all visible text is Arabic.
- Verify route permission visibility.

### Deliverables

- Test suite.
- Manual QA checklist.
- Rollout checklist.
- Backfill verification checklist.

### Risks

- Production data may not match assumptions from factories/seeders.

## API Contract

### POST /api/promotions/preview

Purpose: calculate student results, warnings, and proposed target classrooms without writing promotion records or marks.

Request fields:

- source_academic_year, required and must exist.
- target_academic_year, required and valid academic year format.
- source_classroom_id, required and must exist.
- create_target_academic_year, boolean.

Response includes:

- source and target academic years.
- source classroom.
- students.
- each student academic_result, recommended_decision, warnings, subject_results, and proposed target classroom.
- summary counts.

### POST /api/promotions

Purpose: execute a confirmed promotion batch.

Request fields:

- source_academic_year.
- target_academic_year.
- source_classroom_id.
- create_target_academic_year.
- students array with student_id, decision, target_classroom_id when required, manual_override, and notes.

Response includes:

- promotion batch id.
- source and target academic year.
- status completed.
- completed_at.
- summary counts.
- success message.

### GET /api/promotions

Purpose: list promotion batches.

Filters:

- source_academic_year.
- target_academic_year.
- status.
- source_classroom_id.

### GET /api/promotions/{promotionBatch}

Purpose: show promotion batch details and per-student rows.

### POST /api/promotions/{promotionBatch}/rollback

Purpose: rollback a completed promotion batch when safe.

Request fields:

- reason.

Response includes:

- batch id.
- status rolled_back.
- rolled_back_at.
- success message.

Rollback warning text for UI:

سيتم إلغاء هذه الترقية وإرجاع الطلاب إلى فصولهم السابقة. لا يمكن تنفيذ ذلك إذا تم تسجيل أي بيانات جديدة للعام الدراسي الجديد.

### Marks API

Use the existing students/exams/marks endpoint or introduce a dedicated marks endpoint only for the standalone marks procedure. Promotion endpoints must not save marks.

Validation:

- exam_id required and exists.
- student_id required and exists.
- marks required, numeric, min 0.
- marks cannot exceed exam marks.
- exam grade/language must match student grade/language.
- duplicate marks for same student/exam are prevented by validation and database unique index.

## Implementation Order

1. Resolve remaining open questions.
2. Keep this document as the implementation source of truth.
3. Standardize student status values.
4. Design and create new migrations for promotion/enrollment tables.
5. Modify original exam_student migration to prevent duplicate marks.
6. Add new models and relationships.
7. Add enrollment backfill command/service.
8. Add promotion permissions.
9. Add promotion request classes.
10. Add promotion eligibility service.
11. Add classroom allocator service.
12. Add promotion execution service.
13. Add rollback service.
14. Add promotion controller, resources, and routes.
15. Add or finish standalone marks controller/API support.
16. Add backend tests for marks, preview, execution, and rollback.
17. Add frontend promotion API hooks.
18. Add frontend marks API hooks.
19. Replace incomplete promotion UI.
20. Add separate marks-recording workflow and link to it from promotion warnings.
21. Add review and confirmation UI.
22. Add rollback UI.
23. Add Arabic labels/translations.
24. Run backend tests.
25. Run frontend lint/build.
26. Perform manual QA.
27. Back up production data before rollout.
28. Run enrollment backfill.
29. Verify backfilled enrollments.
30. Deploy promotion feature.

## Files Impact Matrix

| File | Create/Modify | Phase | Reason |
|---|---|---:|---|
| docs/student-promotion-implementation-plan.md | Modify | 1 | Source-of-truth implementation plan |
| database/migrations/*_create_student_enrollments_table.php | Create | 2 | Preserve academic history |
| database/migrations/*_create_promotion_batches_table.php | Create | 2 | Track promotion runs |
| database/migrations/*_create_promotion_batch_students_table.php | Create | 2 | Track per-student promotion decisions |
| database/migrations/2026_03_29_092203_create_exam_student_table.php | Modify | 2 | Prevent duplicate marks |
| database/migrations/12_2025_08_16_195429_create_students_table.php | Modify | 2 | Standardize/index status only if needed |
| app/Models/StudentEnrollment.php | Create | 2 | Enrollment history model |
| app/Models/PromotionBatch.php | Create | 2 | Promotion batch model |
| app/Models/PromotionBatchStudent.php | Create | 2 | Per-student promotion record model |
| app/Models/Student.php | Modify | 2 | Add enrollment relationships |
| app/Models/Classroom.php | Modify | 2 | Add enrollment relationship |
| app/Models/AcademicYear.php | Modify | 2 | Add promotion/enrollment helpers if needed |
| app/Http/Controllers/PromotionController.php | Create | 3 | Promotion API |
| app/Http/Requests/Promotion/PreviewPromotionRequest.php | Create | 3 | Preview validation |
| app/Http/Requests/Promotion/StorePromotionBatchRequest.php | Create | 3 | Execution validation |
| app/Http/Requests/Promotion/RollbackPromotionBatchRequest.php | Create | 3 | Rollback validation |
| app/Http/Resources/PromotionPreviewResource.php | Create | 3 | Preview response formatting |
| app/Http/Resources/PromotionBatchResource.php | Create | 3 | Batch response formatting |
| app/Http/Resources/PromotionBatchStudentResource.php | Create | 3 | Batch student response formatting |
| app/Services/StudentPromotionEligibilityService.php | Create | 3 | Calculate subject pass/fail |
| app/Services/StudentPromotionClassroomAllocator.php | Create | 3 | Assign target classrooms |
| app/Services/StudentPromotionService.php | Create | 3 | Execute promotion transaction |
| app/Services/StudentPromotionRollbackService.php | Create | 3 | Rollback promotion transaction |
| app/Services/StudentEnrollmentService.php | Create | 3 | Manage enrollment state |
| routes/api.php | Modify | 3 | Add promotion and marks routes as needed |
| database/factories/PermissionFactory.php | Modify | 3 | Add promotion permissions |
| app/Http/Controllers/ExamStudentController.php | Modify | 3 | Support standalone marks recording |
| app/Http/Requests/Student/StoreStudentMarkRequest.php | Modify | 3 | Validate standalone marks recording |
| frontend/src/hooks/api/usePromotions.js | Create | 4 | Promotion API hooks |
| frontend/src/hooks/api/useStudentMarks.js | Create | 4 | Marks API hooks |
| frontend/src/components/pages/PromoteStudents/PromoteStudents.jsx | Modify | 4 | Main promotion screen |
| frontend/src/components/pages/PromoteStudents/PromotionWizard.jsx | Create | 4 | Promotion workflow |
| frontend/src/components/pages/PromoteStudents/PromotionFilters.jsx | Create | 4 | Source/target filters |
| frontend/src/components/pages/PromoteStudents/PromotionReviewTable.jsx | Create | 4 | Per-student review and decisions |
| frontend/src/components/pages/PromoteStudents/PromotionSummary.jsx | Create | 4 | Batch summary |
| frontend/src/components/pages/PromoteStudents/PromotionConfirmation.jsx | Create | 4 | Confirmation flow |
| frontend/src/components/pages/PromoteStudents/PromotionBatchDetails.jsx | Create | 4 | Completed batch and rollback view |
| frontend/src/components/pages/StudentMarks/StudentMarksProcedure.jsx | Create | 4 | Standalone marks-recording workflow |
| frontend/src/components/pages/StudentMarks/StudentMarksClassroomPicker.jsx | Create | 4 | Select classroom for marks recording |
| frontend/src/components/pages/StudentMarks/StudentMarksTable.jsx | Create | 4 | Record marks outside promotion |
| frontend/src/routes/students.jsx | Modify | 4 | Route and permission updates |
| frontend/src/translation/ar.json | Modify | 4 | Arabic labels |

## Rollback Strategy

Rollback is an admin action on completed promotion batches.

Rollback is allowed only when all of the following are true:

- batch status is completed.
- batch status is not already rolled_back.
- affected students still match the target state recorded by the batch.
- no target academic year dependent records exist for affected students.

Rollback must check at least:

- payments.academic_year.
- extra_dues.academic_year.
- exemptions if academic-year-specific.
- book_purchases joined to books.academic_year.
- uniform_purchases joined to uniforms.academic_year.
- exam_student joined to exams.academic_year.
- seat_numbers.academic_year.
- secret_numbers.academic_year.

Rollback must restore:

- students.classroom_id.
- students.grade.
- students.level.
- students.status.
- latest/current enrollment state.
- promotion batch status to rolled_back.
- promotion batch student statuses to rolled_back.

Rollback must run inside DB transaction and create activity log entries.

## Edge Cases

- Student has no classroom.
- Student is withdrawn.
- Source classroom has no students.
- Target academic year does not exist.
- Target classroom does not exist.
- Target classroom capacity is insufficient.
- Student has already been promoted.
- Student has incomplete marks.
- Student has duplicate marks before unique index is added.
- Student failed one subject but admin manually promotes.
- Student passed all subjects but admin excludes.
- Grade 11 student passed and should graduate.
- Grade 11 student failed and should repeat in grade 11 in the new academic year.
- Mixed batch includes promoted, repeated, excluded, and graduated students.
- Another admin promotes the same class at the same time.
- Another admin fills target classroom capacity before confirmation.
- Rollback attempted after target-year payments or marks exist.

## Error Handling

- Backend must return validation errors with field-level details.
- Frontend must display row-level errors where possible.
- Blocking errors should prevent confirmation.
- Warnings should be visually clear but not always blocking.
- Manual override should require a clear decision and should be recorded.
- Marks save errors should remain in the standalone marks workflow.

## Authorization Rules

- View promotion screen and batches: view promotions.
- Preview and execute promotion: create promotions.
- Rollback promotion: rollback promotions.
- Standalone marks recording: existing create exam-students or a dedicated marks permission.
- Promotion may show links to marks recording but must not require marks-write permission to execute promotion.

## Audit and History

- Promotion batch records are the primary audit trail.
- Activity logs should capture promotion batch completion, rollback, and manual override summary.
- Marks recording should continue to be audited through the marks model/controller logging behavior.
- student_enrollments preserves academic placement history.
- promotion_batch_students.subject_results preserves pass/fail context at the time of promotion.

## Final Notes

- Do not implement promotion by directly bulk-updating students without recording enrollment and batch history.
- Do not save marks from promotion endpoints.
- Keep marks recording as a separate procedure.
- Do not create new migrations for existing table changes.
- Do create new migrations for new promotion/enrollment tables.
- Keep all frontend user-facing text in Arabic.
- Preserve existing CRUD and table/filter UI patterns.
- Treat the existing PromoteStudents files as partial scaffolding, not a complete implementation.
