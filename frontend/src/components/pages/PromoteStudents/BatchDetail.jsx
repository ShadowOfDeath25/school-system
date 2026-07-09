import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Page from "@ui/Page/Page.jsx";
import StatCard from "@ui/StatCard/StatCard.jsx";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import { useSnackbar } from "@contexts/SnackbarContext.jsx";
import styles from "./styles.module.css";
import axiosClient from "../../../axiosClient.js";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RepeatIcon from "@mui/icons-material/Repeat";
import SchoolIcon from "@mui/icons-material/School";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const DECISION_LABELS = {
    promoted: "ناجح",
    repeated: "إعادة",
    graduated: "متخرج",
    دور_ثاني: "دور ثاني",
};

const DECISION_PILLS = {
    promoted: styles.pillPassed,
    repeated: styles.pillRepeat,
    graduated: styles.pillGraduated,
    دور_ثاني: styles.pillSupplementary,
};

export default function BatchDetail() {
    const { batchId } = useParams();
    const { showSnackbar } = useSnackbar();
    const [batch, setBatch] = useState(null);
    const [gradeMap, setGradeMap] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            axiosClient.get(`/promotion/batches/${batchId}`),
            axiosClient.get("/grades"),
        ])
            .then(([batchRes, gradesRes]) => {
                setBatch(batchRes.data.data);
                const map = {};
                (gradesRes.data.data || []).forEach((g) => {
                    map[g.grade] = g.name;
                });
                setGradeMap(map);
            })
            .catch(() => showSnackbar("حدث خطأ أثناء تحميل البيانات", "error"))
            .finally(() => setLoading(false));
    }, [batchId]);

    if (loading) {
        return (
            <Page>
                <LoadingScreen />
            </Page>
        );
    }

    if (!batch) {
        return (
            <Page breadcrumbsLinks={[<Link to="/promotion/batches">سجل الترقيات</Link>]}>
                <div className={styles.emptyState}>لم يتم العثور على بيانات الترقية</div>
            </Page>
        );
    }

    const students = batch.batch_students || [];

    return (
        <Page
            breadcrumbsLinks={[
                <Link to="/promotion">الترقية</Link>,
                <Link to="/promotion/batches">سجل الترقيات</Link>,
            ]}
        >
            <div className={styles.container}>
                <div className={styles.studentHeader}>
                    <h3>تفاصيل الترقية</h3>
                    <p>
                        من عام {batch.from_academic_year} ← {batch.to_academic_year}
                        {" | "}الحالة:{" "}
                        <span className={`${styles.pill} ${styles.pillCompleted}`}>
                            {batch.status === "completed" ? "مكتمل" : batch.status === "rolled_back" ? "ملغي" : "معلق"}
                        </span>
                    </p>
                </div>
            </div>

            <div className={styles.container}>
                <div className={styles.statsRow}>
                    <StatCard
                        stat={batch.total_students}
                        label="إجمالي الطلاب"
                        icon={<GroupsIcon />}
                        backgroundColor="rgba(191,161,92,0.25)"
                    />
                    <StatCard
                        stat={batch.promoted_count}
                        label="ناجح"
                        icon={<CheckCircleIcon />}
                        backgroundColor="rgba(46,125,50,0.25)"
                    />
                    <StatCard
                        stat={batch.repeated_count}
                        label="إعادة"
                        icon={<RepeatIcon />}
                        backgroundColor="rgba(190,67,74,0.25)"
                    />
                    <StatCard
                        stat={batch.graduated_count}
                        label="متخرج"
                        icon={<SchoolIcon />}
                        backgroundColor="rgba(1,118,250,0.2)"
                    />
                </div>
            </div>

            <div className={styles.container}>
                <h4 className={styles.sectionTitle}>الطلاب</h4>
                {students.length === 0 && (
                    <div className={styles.emptyState}>لا يوجد طلاب في هذه الدفعة</div>
                )}
                {students.length > 0 && (
                    <div className={styles.tableSection}>
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>الطالب</th>
                                    <th>من صف</th>
                                    <th>إلى صف</th>
                                    <th>القرار</th>
                                    <th>دور ثاني</th>
                                    <th>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((s, idx) => (
                                    <tr key={s.id}>
                                        <td>{idx + 1}</td>
                                        <td>{s.student_name}</td>
                                        <td>{gradeMap[s.from_grade] || s.from_grade}</td>
                                        <td>{s.to_grade ? (gradeMap[s.to_grade] || s.to_grade) : "—"}</td>
                                        <td>
                                            <span className={`${styles.pill} ${DECISION_PILLS[s.decision] || ""}`}>
                                                {DECISION_LABELS[s.decision] || s.decision}
                                            </span>
                                        </td>
                                        <td>
                                            {s.decision === "دور_ثاني" ? (
                                                s.second_round_passed === null ? (
                                                    <span className={`${styles.pill} ${styles.pillPending}`}>في الانتظار</span>
                                                ) : s.second_round_passed ? (
                                                    <span className={`${styles.pill} ${styles.pillPassed}`}>نجح</span>
                                                ) : (
                                                    <span className={`${styles.pill} ${styles.pillRepeat}`}>رسب</span>
                                                )
                                            ) : (
                                                "—"
                                            )}
                                        </td>
                                        <td>
                                            <div className={styles.actions}>
                                                {s.decision === "دور_ثاني" && s.second_round_passed === null && (
                                                    <Link
                                                        to={`/promotion/batches/${batchId}/supplementary-exam/${s.student_id}`}
                                                        className={styles.buttonInline}
                                                    >
                                                        حل الدور الثاني
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Page>
    );
}
