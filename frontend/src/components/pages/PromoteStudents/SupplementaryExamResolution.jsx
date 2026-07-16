import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Page from "@ui/Page/Page.jsx";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import { useSnackbar } from "@contexts/SnackbarContext.jsx";
import styles from "./styles.module.css";
import axiosClient from "../../../axiosClient.js";

export default function SupplementaryExamResolution() {
    const { batchId, studentId } = useParams();
    const { showSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [student, setStudent] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [results, setResults] = useState({});

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            try {
                const [batchRes, subjectsRes] = await Promise.all([
                    axiosClient.get(`/promotion/batches/${batchId}`),
                    axiosClient.get(`/promotion/batches/${batchId}/students/${studentId}/supplementary-subjects`),
                ]);

                if (cancelled) return;

                const data = batchRes.data.data;
                const batchStudent = data?.batch_students?.find(
                    (bs) => bs.student_id === Number(studentId)
                );
                if (batchStudent) {
                    setStudent({
                        id: batchStudent.student_id,
                        name: batchStudent.student_name,
                        grade: batchStudent.student_grade,
                    });
                }

                setSubjects(subjectsRes.data.subjects || []);
                setLoading(false);
            } catch {
                if (!cancelled) {
                    showSnackbar("حدث خطأ أثناء تحميل البيانات", "error");
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => { cancelled = true; };
    }, [batchId, studentId]);

    const toggleSubject = (gradeSubjectId, passed) => {
        setResults((prev) => ({ ...prev, [gradeSubjectId]: passed }));
    };

    const handleSave = async () => {
        const subjectResults = Object.entries(results).map(([id, passed]) => ({
            grade_subject_id: Number(id),
            passed,
        }));

        if (subjectResults.length === 0) {
            showSnackbar("يرجى تحديد نتائج المواد", "error");
            return;
        }

        setSaving(true);
        try {
            await axiosClient.post("/promotion/supplementary-exam/resolve", {
                promotion_batch_id: Number(batchId),
                student_id: Number(studentId),
                results: subjectResults,
            });
            showSnackbar("تم حفظ نتائج الدور الثاني بنجاح");
        } catch (err) {
            showSnackbar("حدث خطأ أثناء الحفظ", "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Page>
                <LoadingScreen />
            </Page>
        );
    }

    return (
        <Page
            breadcrumbsLinks={[
                <Link to="/promotion">الترقية</Link>,
                <Link to="/promotion/batches">سجل الترقيات</Link>,
            ]}
        >
            <div className={styles.container}>
                <div className={styles.studentHeader}>
                    <h3>نتيجة الدور الثاني</h3>
                    {student && (
                        <p>
                            الطالب: {student.name} | الصف: {student.grade}
                        </p>
                    )}
                </div>

                {subjects.length === 0 && (
                    <div className={styles.emptyState}>
                        لا توجد مواد متاحة
                    </div>
                )}

                {subjects.length > 0 && (
                    <div className={styles.resolveSection}>
                        <h4>المواد</h4>
                        {subjects.map((subject) => (
                            <div key={subject.grade_subject_id} className={styles.subjectRow}>
                                <span style={{ flex: 1 }}>
                                    {subject.subject_name}
                                    {subject.passed && (
                                        <span style={{ color: 'green', marginRight: 10, fontSize: '0.85rem' }}>(ناجح)</span>
                                    )}
                                </span>
                                <label>
                                    <input
                                        type="radio"
                                        name={`subject-${subject.grade_subject_id}`}
                                        checked={results[subject.grade_subject_id] === true}
                                        onChange={() => toggleSubject(subject.grade_subject_id, true)}
                                    />
                                    ناجح
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name={`subject-${subject.grade_subject_id}`}
                                        checked={results[subject.grade_subject_id] === false}
                                        onChange={() => toggleSubject(subject.grade_subject_id, false)}
                                    />
                                    راسب
                                </label>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                    <button
                        className={styles.button}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "جاري الحفظ..." : "حفظ النتيجة"}
                    </button>
                </div>
            </div>
        </Page>
    );
}
