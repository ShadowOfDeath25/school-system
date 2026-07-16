import { useState, useEffect, useMemo, Fragment } from "react";
import { useParams, useLocation, useSearchParams, useNavigate, Link } from "react-router-dom";
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
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const round = searchParams.get('round') || 'first';
    const { showSnackbar } = useSnackbar();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [promoting, setPromoting] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState(new Set());
    const [editedMarks, setEditedMarks] = useState({});
    const [dirty, setDirty] = useState({});

    useEffect(() => {
        axiosClient.get(`marks/student/${studentId}/exams?round=${round}`)
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

    const toggleGroup = (key) => {
        setExpandedGroups(prev => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
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
                        round,
                    });
                }
                results.push({ examId, success: true });
            } catch (error) {
                results.push({ examId, success: false });
            }
        }

        const res = await axiosClient.get(`marks/student/${studentId}/exams?round=${round}`);
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

    const handlePromote = async () => {
        setPromoting(true);
        try {
            await axiosClient.post(`marks/second-round/${studentId}/promote`);
            showSnackbar("تم ترقية الطالب بنجاح");
            navigate("/marks/second-round");
        } catch (error) {
            showSnackbar("حدث خطأ أثناء ترقية الطالب", "error");
            setPromoting(false);
        }
    };

    const student = data?.student;
    const exams = data?.exams ?? [];

    const groupedBySemester = useMemo(() => {
        const map = {};
        for (const exam of exams) {
            if (!map[exam.semester]) map[exam.semester] = {};
            const groupKey = `${exam.subject_name}|${exam.exam_name}`;
            if (!map[exam.semester][groupKey]) {
                map[exam.semester][groupKey] = {
                    key: groupKey,
                    subject_name: exam.subject_name,
                    exam_name: exam.exam_name,
                    components: [],
                };
            }
            map[exam.semester][groupKey].components.push(exam);
        }
        return Object.entries(map).map(([semester, groups]) => ({
            semester,
            groups: Object.values(groups),
        }));
    }, [exams]);

    const breadcrumbsLinks = round === 'second'
        ? [
            <Link to={"/marks"} className={styles.breadcrumbLink}>تسجيل الدرجات</Link>,
            <Link to={"/marks/second-round"} className={styles.breadcrumbLink}>دور ثاني</Link>,
        ]
        : [
            <Link to={"/marks"} className={styles.breadcrumbLink}>الأرقام السرية</Link>,
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
                    <h3>
                        {round === 'second' ? 'دور ثاني' : (state?.secret_number ? `الرقم السري: ${state.secret_number}` : "تسجيل الدرجات")}
                    </h3>
                    <div className={localStyles.studentMeta}>
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

            {groupedBySemester.map(({ semester, groups }) => (
                <div key={semester} className={localStyles.semesterSection}>
                    <h4 className={localStyles.semesterTitle}>الفصل {semester}</h4>
                    <table className={localStyles.marksTable}>
                        <thead>
                            <tr>
                                <th>المادة</th>
                                <th>الامتحان</th>
                                <th>الدرجة الكلية</th>
                                <th>المستوى</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {groups.map(group => {
                                const isExpanded = expandedGroups.has(group.key);
                                const totalMarks = group.components.reduce((sum, c) => {
                                    const m = getCurrentMark(c);
                                    return sum + Number(m || 0);
                                }, 0);
                                const totalMax = group.components.reduce((sum, c) => sum + (c.component_max_marks || 0), 0);
                                const totalColor = totalMax > 0
                                    ? getMarkPerformanceColor(totalMarks, totalMax)
                                    : "#7f8c8d";

                                return (
                                    <Fragment key={group.key}>
                                        <tr
                                            className={`${localStyles.groupRow} ${isExpanded ? localStyles.groupRowExpanded : ""}`}
                                            onClick={() => toggleGroup(group.key)}
                                        >
                                            <td>{group.subject_name}</td>
                                            <td>{group.exam_name}</td>
                                            <td className={localStyles.totalMarksCell}>
                                                <span
                                                    className={localStyles.totalMarkValue}
                                                    style={{ color: totalColor }}
                                                >
                                                    {totalMarks} / {totalMax}
                                                </span>
                                            </td>
                                            <td className={localStyles.performanceCell}>
                                                <span className={localStyles.performanceBadge} style={{ color: totalColor }}>
                                                    {totalMax > 0 ? getMarkPerformanceLabel(totalMarks, totalMax) : ""}
                                                </span>
                                            </td>
                                            <td className={localStyles.chevronCell}>
                                                <span className={`${localStyles.chevron} ${isExpanded ? localStyles.chevronOpen : ""}`}>
                                                    ▼
                                                </span>
                                            </td>
                                        </tr>
                                        {isExpanded && group.components.map(comp => {
                                            const currentMark = getCurrentMark(comp);
                                            const numericMark = currentMark === "" ? null : Number(currentMark);
                                            const color = comp.component_max_marks
                                                ? getMarkPerformanceColor(numericMark, comp.component_max_marks)
                                                : "#7f8c8d";
                                            const label = comp.component_max_marks
                                                ? getMarkPerformanceLabel(numericMark, comp.component_max_marks)
                                                : "";

                                            return (
                                                <tr key={comp.exam_id} className={localStyles.componentRow}>
                                                    <td></td>
                                                    <td className={localStyles.componentNameCell}>{comp.component_name}</td>
                                                    <td className={localStyles.maxMarksCell}>{comp.component_max_marks}</td>
                                                    <td className={localStyles.marksCell}>
                                                        <div className={localStyles.inputWrapper}>
                                                            <input
                                                                type="number"
                                                                min={0}
                                                                max={comp.component_max_marks ?? undefined}
                                                                step={0.1}
                                                                value={currentMark}
                                                                onChange={(e) => handleMarkChange(comp.exam_id, e.target.value)}
                                                                className={localStyles.marksInput}
                                                                style={{ border: `4px solid ${color}` }}
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
                                    </Fragment>
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
                {round === 'second' && (
                    <button
                        onClick={handlePromote}
                        disabled={promoting}
                        className={localStyles.promoteButton}
                    >
                        {promoting ? "جاري الترقية..." : "ترقية الطالب"}
                    </button>
                )}
            </div>
        </Page>
    );
}
