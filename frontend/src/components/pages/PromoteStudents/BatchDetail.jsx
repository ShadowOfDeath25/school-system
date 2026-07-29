import {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import Page from "@ui/Page/Page.jsx";
import StatCard from "@ui/StatCard/StatCard.jsx";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
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
    const {batchId} = useParams();
    const {showSnackbar} = useSnackbar();
    const [batch, setBatch] = useState(null);
    const [gradeMap, setGradeMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [finalizing, setFinalizing] = useState(false);
    const [groupByGender, setGroupByGender] = useState(false);
    const [groupTopStudents, setGroupTopStudents] = useState(false);
    const [topStudentCount, setTopStudentCount] = useState("");

    useEffect(() => {
        Promise.all([
            axiosClient.get(`/promotion/batches/${batchId}`),
            axiosClient.get("/grades"),
        ])
            .then(([batchRes, gradesRes]) => {
                setBatch(batchRes.data.data);
                const map = {};
                (gradesRes.data.data || []).forEach((g) => {
                    map[g.id] = g.name;
                });
                setGradeMap(map);
            })
            .catch(() => showSnackbar("حدث خطأ أثناء تحميل البيانات", "error"))
            .finally(() => setLoading(false));
    }, [batchId]);

    if (loading) {
        return (
            <Page>
                <LoadingScreen/>
            </Page>
        );
    }

    if (!batch) {
        return (
            <Page breadcrumbsLinks={[<Link to="/marks/promotions/batches">سجل الترقيات</Link>]}>
                <div className={styles.emptyState}>لم يتم العثور على بيانات الترقية</div>
            </Page>
        );
    }

    const students = batch.batch_students || [];

    return (
        <Page
            breadcrumbsLinks={[
                <Link to="/marks/promotion">الترقية</Link>,
                <Link to="/marks/promotions/batches">سجل الترقيات</Link>,
            ]}
        >
            <div className={styles.container}>
                <div className={styles.studentHeader}>
                    <h3>تفاصيل الترقية</h3>
                    <p>
                        من عام {batch.from_academic_year} ← {batch.to_academic_year}
                        {" | "}الحالة:{" "}
                        <span
                            className={`${styles.pill} ${batch.status === "completed" ? styles.pillCompleted : batch.status === "rolled_back" ? styles.pillRolledBack : styles.pillPending}`}>
                            {batch.status === "completed" ? "مكتمل" : batch.status === "rolled_back" ? "ملغي" : "بانتظار التفعيل"}
                        </span>
                    </p>
                </div>
            </div>

            <div className={styles.container}>
                <div className={styles.statsRow}>
                    <StatCard
                        stat={batch.total_students}
                        label="إجمالي الطلاب"
                        icon={<GroupsIcon/>}
                        backgroundColor="rgba(191,161,92,0.25)"
                    />
                    <StatCard
                        stat={batch.promoted_count}
                        label="ناجح"
                        icon={<CheckCircleIcon/>}
                        backgroundColor="rgba(46,125,50,0.25)"
                    />
                    <StatCard
                        stat={batch.repeated_count}
                        label="إعادة"
                        icon={<RepeatIcon/>}
                        backgroundColor="rgba(190,67,74,0.25)"
                    />
                    <StatCard
                        stat={batch.graduated_count}
                        label="متخرج"
                        icon={<SchoolIcon/>}
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
                                                    <span
                                                        className={`${styles.pill} ${styles.pillPending}`}>في الانتظار</span>
                                                ) : s.second_round_passed ? (
                                                    <span className={`${styles.pill} ${styles.pillPassed}`}>نجح</span>
                                                ) : (
                                                    <span className={`${styles.pill} ${styles.pillRepeat}`}>رسب</span>
                                                )
                                            ) : (
                                                "—"
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {batch.status === "pending" && (
                <div className={styles.container}>
                    <div className={styles.finalizeOptions}>
                        <div>
                            <h4 className={styles.sectionTitle}>توزيع الطلاب على الفصول</h4>
                            <p className={styles.optionsDescription}>
                                اختر طريقة توزيع الطلاب عند إنهاء الترقية. تطبق الخيارات على الطلاب الناجحين وطلاب
                                الإعادة.
                            </p>
                        </div>
                        <div className={styles.options}>

                            <label className={styles.optionCard}>
                                <input
                                    type="checkbox"
                                    checked={groupByGender}
                                    onChange={(event) => setGroupByGender(event.target.checked)}
                                />
                                <span>
                                <strong>فصل الطلاب عن الطالبات</strong>
                                <small>توزيع البنين والبنات في مجموعات فصول منفصلة.</small>
                            </span>
                            </label>
                            <label className={styles.optionCard}>
                                <input
                                    type="checkbox"
                                    checked={groupTopStudents}
                                    onChange={(event) => {
                                        setGroupTopStudents(event.target.checked);
                                        if (!event.target.checked) setTopStudentCount("");
                                    }}
                                />
                                <span>
                                <strong>تجميع الطلاب الأوائل معًا</strong>
                                <small>ترتيب الطلاب حسب مجموع الدرجات وتجميع العدد المحدد منهم.</small>
                            </span>
                            </label>
                            {groupTopStudents && (
                                <label className={styles.numberField}>
                                    <span>عدد الطلاب الأوائل</span>
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={topStudentCount}
                                        onChange={(event) => setTopStudentCount(event.target.value)}
                                        placeholder="مثال: 30"
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                    <div className={styles.finalizeActions}>
                        <button
                            className={styles.button}
                            disabled={finalizing || (groupTopStudents && Number(topStudentCount) < 1)}
                            onClick={async () => {
                                setFinalizing(true);
                                try {
                                    await axiosClient.post(`/promotion/batches/${batch.id}/finalize`, {
                                        group_by_gender: groupByGender,
                                        top_student_count: groupTopStudents ? Number(topStudentCount) : 0,
                                    });
                                    showSnackbar("تم إنهاء الترقية بنجاح");
                                    const res = await axiosClient.get(`/promotion/batches/${batch.id}`);
                                    setBatch(res.data.data);
                                } catch (err) {
                                    const msg = err.response?.data?.message || "حدث خطأ أثناء إنهاء الترقية";
                                    showSnackbar(msg, "error");
                                } finally {
                                    setFinalizing(false);
                                }
                            }}
                        >
                            {finalizing ? "جاري إنهاء الترقية..." : "إنهاء الترقية"}
                        </button>
                        <button
                            className={`${styles.button} ${styles.buttonDanger}`}
                            disabled={finalizing}
                            onClick={async () => {
                                try {
                                    await axiosClient.post(`/promotion/batches/${batch.id}/delete`);
                                    showSnackbar("تم حذف دفعة الترقية بنجاح");
                                    setBatch(null);
                                } catch (err) {
                                    const msg = err.response?.data?.message || "حدث خطأ أثناء الحذف";
                                    showSnackbar(msg, "error");
                                }
                            }}
                        >
                            حذف الدفعة
                        </button>
                    </div>
                </div>
            )}
        </Page>
    );
}
