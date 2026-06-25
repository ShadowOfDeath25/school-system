# Dynamic Grading Components Impact Analysis

## Scope Implemented

The fixed `classwork_marks` / computed `exam_marks` structure has been replaced with mark-based grading components stored on `grade_subject.components` as JSON. Subject totals are derived from component marks and preserved in `max_marks` for compatibility with existing API/UI paths.

## Backend Impact

- `database/migrations/2026_03_06_082659_create_grade_subject_table.php`: replaces `classwork_marks` with `components` JSON.
- `database/migrations/2222_2025_09_21_234202_create_exams_table.php`: adds `component_id` to bind each exam to a configured component.
- `app/Models/GradeSubject.php`: casts components, computes `total_marks`, final exam marks, and component lookup dynamically.
- `app/Models/Grade.php` and `app/Models/Subject.php`: pivot fields now include `components` instead of `classwork_marks`.
- `app/Models/Exam.php`: stores `component_id` and exposes the selected component.
- `app/Observers/ExamObserver.php`: derives exam marks from the selected component maximum.
- `app/Services/GradingComponentService.php`: centralizes component normalization, validation, and total calculation.
- `app/Http/Requests/Subject/*GradeSubjectsRequest.php`: validates dynamic components, marks, and final exam presence.
- `app/Http/Controllers/GradeController.php`: normalizes components and derives `max_marks` before attach/update.
- `app/Http/Resources/GradeSubjectResource.php`: returns `components`, `total_marks`, and compatibility `exam_marks` values.
- `app/Http/Requests/Exam/*ExamRequest.php`: validates that `component_id` belongs to the selected grade subject.
- `app/Http/Resources/ExamResource.php`: returns component metadata.
- `app/Http/Requests/Student/StoreStudentMarkRequest.php`: prevents marks above the selected component maximum.

## Frontend Impact

- `frontend/src/components/ui/SubjectPicker/SubjectPicker.jsx`: subject assignment now manages component name, marks, and final exam flags in Arabic RTL UI.
- `frontend/src/components/ui/SubjectPicker/styles.module.css`: adds compact component display styling.
- `frontend/src/components/pages/Exams/AddExams.jsx`: exam creation requires selecting a grading component after selecting a subject.
- `frontend/src/components/pages/Exams/ViewExams.jsx`: exam listing displays the selected component.

## API Contract Changes

Grade subject responses now include:

```json
{
  "total_marks": 100,
  "components": [
    {"id": "coursework", "name": "أعمال السنة", "marks": 40, "is_final_exam": false},
    {"id": "final_exam", "name": "الاختبار النهائي", "marks": 60, "is_final_exam": true}
  ]
}
```

Exam create/update requests now require `component_id`.

## Data Compatibility Strategy

The original migrations were updated directly because the project is still under development. Existing old-shape data should be converted before reseeding or migration refresh by mapping `classwork_marks` to an `أعمال السنة` component and `max_marks - classwork_marks` to an `الاختبار النهائي` component. No new table was introduced because the JSON structure is sufficient for the component definitions and avoids unnecessary schema complexity.

## Remaining Risks

- Existing rows in a non-refreshed development database need a one-time conversion to populate `components` and exam `component_id`.
- Student report card/transcript grade calculations were not present as fixed classwork/final-exam logic in the inspected codebase, so no report template changes were needed beyond API readiness.
- Frontend component management is intentionally compact and follows the existing input modal pattern; adding unlimited components from the modal may later deserve a richer repeated-row editor.