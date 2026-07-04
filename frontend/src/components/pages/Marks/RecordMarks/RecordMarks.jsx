import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import Page from "@ui/Page/Page.jsx";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import styles from "@ui/Page/style.module.css";
import localStyles from './styles.module.css';
import { getMarkPerformanceColor, getMarkPerformanceLabel } from "@helpers/MarksHelper.js";
import { useSnackbar } from "@contexts/SnackbarContext.jsx";
import axiosClient from "../../../../axiosClient.js";

export default function RecordMarks() {
    const { studentId } = useParams();
    const { state } = useLocation();
    const { showSnackbar } = useSnackbar();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editedMarks, setEditedMarks] = useState({});
    const [dirty, setDirty] = useState({});

    useEffect(() => {
        axiosClient.get(`marks/student/${studentId}/exams`)
            .then((res) => {
                setData(res.data);
                setLoading(false);
            })
            .catch(() => {
                showSnackbar("حدث خطأ أثناء تحميل البيانات", "error");
                setLoading(false);
            });
    }, [studentId]);

    const handleMarkChange = (examId, value) => {
        setEditedMarks((prev) => ({ ...prev, [examId]: value }));
        setDirty((prev) => ({ ...prev, [examId]: true }));
    };

    const getCurrentMark = (exam) => {
        return dirty[exam.exam_id] ? editedMarks[exam.exam_id] : (exam.marks ?? "");
    };

    const handleSave = async () => {
        if (!data) return;
        setSaving(true);
        const dirtyExamIds = Object.keys(dirty);
        const results = [];

        for (const examId of dirtyExamIds) {
            const exam = data.exams.find((e) => e.exam_id === Number(examId));
            if (!exam) continue;

            const newMarks = editedMarks[examId];
            const originalMark = exam.marks;
            const normalizedNew = newMarks === "" ? null : Number(newMarks);
            const normalizedOriginal = originalMark === null ? null : Number(originalMark);

            if (normalizedNew === normalizedOriginal) continue;

            try {
                if (exam.marks_id) {
                    await axiosClient.put(`marks/${exam.marks_id}`, { marks: normalizedNew });
                } else if (normalizedNew !== null) {
                    await axiosClient.post("marks", {
                        exam_id: exam.exam_id,
                        student_id: Number(studentId),
                        component_id: exam.component_id,
                        marks: normalizedNew,
                    });
                }
                results.push({ examId, success: true });
            } catch (error) {
                results.push({ examId, success: false });
            }
        }

        const res = await axiosClient.get(`marks/student/${studentId}/exams`);
        setData(res.data);
        setEditedMarks({});
        setDirty({});

        const allSuccess = results.length === 0 || results.every((r) => r.success);
        if (results.length === 0) {
            showSnackbar("لا توجد تغييرات للحفظ");
        } else {
            showSnackbar(allSuccess ? "تم حفظ الدرجات بنجاح" : "حدث خطأ أثناء حفظ بعض الدرجات", allSuccess ? undefined : "error");
        }
        setSaving(false);
    };

    const student = data?.student;
    const exams = data?.exams ?? [];

    const groupedBySemester = {};
    for (const exam of exams) {
        if (!groupedBySemester[exam.semester]) groupedBySemester[exam.semester] = [];
        groupedBySemester[exam.semester].push(exam);
    }

    const breadcrumbsLinks = [
        <Link to={"/marks"} className={styles.breadcrumbLink}>الفصول الدراسية</Link>,
        ...(state?.classroom?.id
            ? [<Link to={`/marks/classrooms/${state.classroom.id}`} state={state} className={styles.breadcrumbLink}>اختر طالب</Link>]
            : []),
    ];

    const dirtyCount = Object.keys(dirty).length;

    if (loading) {
        return (
            <Page breadcrumbsLinks={breadcrumbsLinks}>
                <LoadingScreen />
            </Page>
        );
    }

    return (
        <Page breadcrumbsLinks={breadcrumbsLinks}>
            {student && (
                <div className={localStyles.studentHeader}>
                    <h3>{student.name_in_arabic}</h3>
                    <div className={localStyles.studentMeta}>
                        <span>رقم القيد: {student.reg_number}</span>
                        <span>الصف: {student.grade_name}</span>
                        <span>المرحلة: {student.level}</span>
                        <span>اللغة: {student.language}</span>
                    </div>
                </div>
            )}

            {exams.length === 0 && (
                <div className={localStyles.emptyState}>
                    <h3>لا توجد امتحانات متاحة لهذا الطالب</h3>
                </div>
            )}

            {Object.entries(groupedBySemester).map(([semester, semesterExams]) => (
                <div key={semester} className={localStyles.semesterSection}>
                    <h4 className={localStyles.semesterTitle}>الفصل {semester}</h4>
                    <table className={localStyles.marksTable}>
                        <thead>
                            <tr>
                                <th>المادة</th>
                                <th>الامتحان</th>
                                <th>المكون</th>
                                <th>الدرجة العظمى</th>
                                <th>الدرجة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {semesterExams.map((exam) => {
                                const currentMark = getCurrentMark(exam);
                                const numericMark = currentMark === "" ? null : Number(currentMark);
                                const color = exam.component_max_marks
                                    ? getMarkPerformanceColor(numericMark, exam.component_max_marks)
                                    : "#7f8c8d";
                                const label = exam.component_max_marks
                                    ? getMarkPerformanceLabel(numericMark, exam.component_max_marks)
                                    : "";

                                return (
                                    <tr key={exam.exam_id}>
                                        <td>{exam.subject_name}</td>
                                        <td>{exam.exam_name}</td>
                                        <td>{exam.component_name}</td>
                                        <td className={localStyles.maxMarksCell}>{exam.component_max_marks}</td>
                                        <td className={localStyles.marksCell}>
                                            <div className={localStyles.inputWrapper}>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    max={exam.component_max_marks ?? undefined}
                                                    step={0.1}
                                                    value={currentMark}
                                                    onChange={(e) => handleMarkChange(exam.exam_id, e.target.value)}
                                                    className={localStyles.marksInput}
                                                    style={{ borderLeft: `4px solid ${color}` }}
                                                    placeholder="—"
                                                />
                                                {numericMark !== null && (
                                                    <span className={localStyles.performanceLabel} style={{ color }}>
                                                        {label}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ))}

            <div className={localStyles.actions}>
                <button
                    onClick={handleSave}
                    disabled={saving || dirtyCount === 0}
                    className={localStyles.saveButton}
                >
                    {saving ? "جاري الحفظ..." : `حفظ التغييرات (${dirtyCount})`}
                </button>
            </div>
        </Page>
    );
}
