import { useState, useEffect } from "react";
import Page from "@ui/Page/Page.jsx";
import SelectField from "@ui/SelectField/SelectField.jsx";
import StatCard from "@ui/StatCard/StatCard.jsx";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import { useSnackbar } from "@contexts/SnackbarContext.jsx";
import ConfirmModal from "@ui/ConfirmModal/ConfirmModal.jsx";
import styles from "./styles.module.css";
import axiosClient from "../../../axiosClient.js";
import EligibilityPreview from "./EligibilityPreview.jsx";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RepeatIcon from "@mui/icons-material/Repeat";
import SchoolIcon from "@mui/icons-material/School";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const GRADE_OPTIONS = [
    { value: "1", label: "الاول رياض أطفال" },
    { value: "2", label: "الثاني رياض أطفال" },
    { value: "3", label: "الاول الابتدائي" },
    { value: "4", label: "الثاني الابتدائي" },
    { value: "5", label: "الثالث الابتدائي" },
    { value: "6", label: "الرابع الابتدائي" },
    { value: "7", label: "الخامس الابتدائي" },
    { value: "8", label: "السادس الابتدائي" },
    { value: "9", label: "الاول الاعدادي" },
    { value: "10", label: "الثاني الاعدادي" },
    { value: "11", label: "الثالث الاعدادي" },
];

const LANGUAGE_OPTIONS = [
    { value: "عربي", label: "عربي" },
    { value: "لغات", label: "لغات" },
];

export default function PromotionDashboard() {
    const { showSnackbar } = useSnackbar();
    const [academicYears, setAcademicYears] = useState([]);
    const [fromYear, setFromYear] = useState("");
    const [grade, setGrade] = useState("");
    const [language, setLanguage] = useState("");
    const [loading, setLoading] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [showExecuteModal, setShowExecuteModal] = useState(false);
    const [executeLoading, setExecuteLoading] = useState(false);

    const computeNextYear = (year) => {
        if (!year) return "";
        const parts = year.split(/[/\-_]/);
        if (parts.length < 2) return "";
        const sep = year.includes("/") ? "/" : year.includes("_") ? "_" : "-";
        const next = parts.map((p) => String(Number(p) + 1));
        return next.join(sep);
    };
    const toYear = computeNextYear(fromYear);

    useEffect(() => {
        axiosClient.get("/academic-years", { params: { nameOnly: true } })
            .then((res) => {
                const years = (res.data.data || []).map((y) => ({
                    value: y.name,
                    label: y.name,
                }));
                setAcademicYears(years);
            })
            .catch(() => {});
    }, []);

    const fetchPreview = async () => {
        if (!fromYear || !grade) {
            showSnackbar("يرجى اختيار العام الدراسي والصف", "error");
            return;
        }
        setLoading(true);
        try {
            const res = await axiosClient.get("/promotion/preview", {
                params: { from_year: fromYear, grade, language: language || undefined },
            });
            setPreviewData(res.data);
        } catch (err) {
            showSnackbar("حدث خطأ أثناء تحميل البيانات", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleExecute = async () => {
        setExecuteLoading(true);
        try {
            await axiosClient.post("/promotion/execute", {
                from_academic_year: fromYear,
                grade: Number(grade),
            });
            showSnackbar("تم تنفيذ الترقية بنجاح");
            setShowExecuteModal(false);
            setPreviewData(null);
        } catch (err) {
            const msg = err.response?.data?.message || "حدث خطأ أثناء تنفيذ الترقية";
            showSnackbar(msg, "error");
        } finally {
            setExecuteLoading(false);
        }
    };

    const breakdown = previewData?.breakdown || {};
    const yearOptions = academicYears;

    return (
        <Page>
            <div className={styles.container}>
                <div className={styles.filters}>
                    <div className={styles.filterItem}>
                        <SelectField
                            name="fromYear"
                            label="العام الدراسي الحالي"
                            value={fromYear}
                            handleChange={(e) => setFromYear(e.target.value)}
                            options={yearOptions}
                            placeholder="اختر العام"
                        />
                    </div>
                    <div className={styles.filterItem}>
                        <SelectField
                            name="grade"
                            label="الصف الدراسي"
                            value={grade}
                            handleChange={(e) => setGrade(e.target.value)}
                            options={GRADE_OPTIONS}
                            placeholder="اختر الصف"
                        />
                    </div>
                    <div className={styles.filterItem}>
                        <SelectField
                            name="language"
                            label="اللغة"
                            value={language}
                            handleChange={(e) => setLanguage(e.target.value)}
                            options={LANGUAGE_OPTIONS}
                            placeholder="الكل"
                        />
                    </div>
                    <div className={styles.filterActions}>
                        <button
                            className={styles.button}
                            onClick={fetchPreview}
                            disabled={loading}
                        >
                            {loading ? "جاري التحميل..." : "عرض الترقية"}
                        </button>
                    </div>
                </div>
            </div>

            {loading && <LoadingScreen />}

            {previewData && !loading && (
                <>
                    <div className={styles.container}>
                        <div className={styles.statsRow}>
                            <StatCard
                                stat={breakdown.total || 0}
                                label="إجمالي الطلاب"
                                icon={<GroupsIcon />}
                                backgroundColor="rgba(191,161,92,0.25)"
                            />
                            <StatCard
                                stat={breakdown.passed || 0}
                                label="ناجح"
                                icon={<CheckCircleIcon />}
                                backgroundColor="rgba(46,125,50,0.25)"
                            />
                            <StatCard
                                stat={breakdown["دور_ثاني_eligible"] || 0}
                                label="دور ثاني"
                                icon={<WarningAmberIcon />}
                                backgroundColor="rgba(191,161,92,0.25)"
                            />
                            <StatCard
                                stat={breakdown.repeat || 0}
                                label="راسب (إعادة)"
                                icon={<RepeatIcon />}
                                backgroundColor="rgba(190,67,74,0.25)"
                            />
                            <StatCard
                                stat={breakdown.graduated || 0}
                                label="متخرج"
                                icon={<SchoolIcon />}
                                backgroundColor="rgba(1,118,250,0.2)"
                            />
                        </div>
                    </div>

                    <div className={styles.container}>
                        <EligibilityPreview students={previewData.students} />
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                            <button
                                className={styles.button}
                                onClick={() => setShowExecuteModal(true)}
                            >
                                تنفيذ الترقية
                            </button>
                        </div>
                    </div>
                </>
            )}

            {showExecuteModal && (
                <ConfirmModal
                    open={showExecuteModal}
                    onConfirm={handleExecute}
                    onCancel={() => setShowExecuteModal(false)}
                    message={`تنفيذ الترقية للعام ${fromYear} ← ${toYear}؟ سيتم ترقية ${breakdown.total || 0} طالب. سيتم إنشاء العام الدراسي ${toYear} تلقائياً إذا لم يكن موجوداً.`}
                    warning="لا يمكن التراجع عن هذه العملية بسهولة."
                />
            )}
        </Page>
    );
}
