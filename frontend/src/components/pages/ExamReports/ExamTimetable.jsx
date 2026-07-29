import { useState } from "react";
import styles from "@pages/StudentReports/styles.module.css";
import Page from "@ui/Page/Page.jsx";
import SelectField from "@ui/SelectField/SelectField.jsx";
import Button from "@mui/material/Button";
import axiosClient from "../../../axiosClient.js";
import { useGetAll } from "@hooks/api/useCrud.js";
import { usePDFPreview } from "@contexts/PDFPreviewContext.jsx";
import { useSnackbar } from "@contexts/SnackbarContext.jsx";
import { useExport } from "@hooks/useExport.js";
import { ClassroomHelper } from "@helpers/ClassroomHelper.js";

const SEMESTER_OPTIONS = [
    { value: "الأول", label: "الفصل الدراسي الأول" },
    { value: "الثاني", label: "الفصل الدراسي الثاني" },
];

export default function ExamTimetable() {
    const [formData, setFormData] = useState({ semester: "الأول" });
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { showPDFPreview } = usePDFPreview();
    const { exportAsExcel } = useExport();
    const { showSnackbar } = useSnackbar();

    const { data: academicYears = [] } = useGetAll("academic-years", {}, {
        select: (data) => data?.data?.map((ay) => ay.name),
    });

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const normalizeData = () => {
        const result = { ...formData };
        if (!result.academic_year) return null;
        if (result.grade === "" || result.grade === undefined) {
            delete result.grade;
        }
        if (!result.level) {
            delete result.level;
        }
        return result;
    };

    const handleView = async () => {
        const params = normalizeData();
        if (!params) {
            showSnackbar("يجب اختيار عام دراسي", "error");
            return;
        }
        if (!params.language) {
            showSnackbar("يجب اختيار اللغة", "error");
            return;
        }
        setLoading(true);
        try {
            const response = await axiosClient.get("/reports/students/exam-timetable", { params });
            setReportData(response.data);
        } catch (error) {
            showSnackbar(error?.response?.data?.message || "فشل تحميل البيانات", "error");
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = async () => {
        const params = normalizeData();
        if (!params) {
            showSnackbar("يجب اختيار عام دراسي", "error");
            return;
        }
        if (!params.language) {
            showSnackbar("يجب اختيار اللغة", "error");
            return;
        }
        try {
            params.export = "pdf";
            const response = await axiosClient.get("/reports/students/exam-timetable", { params });
            showPDFPreview({ url: response.data.preview_url });
        } catch (error) {
            showSnackbar(error?.response?.data?.message || "فشل تحميل التقرير", "error");
        }
    };

    const handleExport = () => {
        const params = normalizeData();
        if (!params) {
            showSnackbar("يجب اختيار عام دراسي", "error");
            return;
        }
        if (!params.language) {
            showSnackbar("يجب اختيار اللغة", "error");
            return;
        }
        exportAsExcel("/reports/students/exam-timetable", params);
    };

    const handleReset = () => {
        setFormData({ semester: "الأول" });
        setReportData(null);
    };

    const filterContent = (
        <div className={styles.body}>
            <SelectField
                label={"العام الدراسي"}
                options={academicYears}
                placeholder={"اختر العام الدراسي"}
                value={formData.academic_year}
                handleChange={handleChange}
                name={"academic_year"}
            />
            <SelectField
                label={"اللغة"}
                options={["عربي", "لغات"]}
                placeholder={"اختر اللغة"}
                value={formData.language}
                handleChange={handleChange}
                name={"language"}
            />
            <SelectField
                {...ClassroomHelper.FIELDS.LEVEL}
                value={formData.level}
                handleChange={handleChange}
                name={"level"}
            />
            <SelectField
                {...ClassroomHelper.FIELDS.GRADE}
                options={ClassroomHelper.getGradeOptionsByLevel(formData.level)}
                disabled={!formData.level}
                value={formData.grade}
                handleChange={handleChange}
                name={"grade"}
            />
            <SelectField
                label={"الفصل الدراسي"}
                options={SEMESTER_OPTIONS}
                placeholder={"اختر الفصل الدراسي"}
                value={formData.semester}
                handleChange={handleChange}
                name={"semester"}
            />
        </div>
    );

    const actions = (
        <div className={styles.actions}>
            <Button variant={"contained"} color="primary" onClick={handleView} disabled={loading}>
                {loading ? "جاري التحميل..." : "عرض"}
            </Button>
            <Button variant={"contained"} color="primary" onClick={handlePrint}>
                طباعة
            </Button>
            <Button variant="outlined" color="primary" onClick={handleExport}>
                تصدير ك EXCEL
            </Button>
            <Button variant={"contained"} color={"error"} onClick={handleReset}>
                اعادة تعيين
            </Button>
        </div>
    );

    const results = reportData && (
        <div className={styles.container} style={{ marginTop: 16 }}>
            <h4 className={styles.title}>
                جدول امتحانات نهاية الفصل — {reportData.language}
                — الفصل {reportData.semester === "الأول" ? "الدراسي الأول" : "الدراسي الثاني"}
                {" — "}{reportData.academic_year}
            </h4>
            {reportData.grades?.map((grade) => (
                <div key={grade.grade_id} style={{ marginTop: 16 }}>
                    <p className={styles.summary}>
                        {grade.grade_name} — عدد الامتحانات: {grade.total_exams}
                    </p>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.th}>م</th>
                                    <th className={styles.th}>المادة</th>
                                    <th className={styles.th}>التاريخ</th>
                                    <th className={styles.th}>اليوم</th>
                                    <th className={styles.th}>الوقت</th>
                                    <th className={styles.th}>المدة (ساعات)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grade.exams?.map((exam) => (
                                    <tr key={`${exam.subject_name}-${exam.date}`}>
                                        <td className={styles.td}>{exam.index}</td>
                                        <td className={styles.td}>{exam.subject_name}</td>
                                        <td className={styles.td}>{new Date(exam.date).toLocaleDateString("en-CA")}</td>
                                        <td className={styles.td}>{exam.day}</td>
                                        <td className={styles.td}>{exam.time}</td>
                                        <td className={styles.td}>{exam.duration}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
            {(!reportData.grades || reportData.grades.length === 0) && (
                <p className={styles.emptyState}>لا توجد بيانات</p>
            )}
        </div>
    );

    return (
        <Page>
            <div className={styles.container}>
                <h4 className={styles.title}>جدول امتحانات نهاية الفصل</h4>
            </div>
            <div className={styles.container} style={{ marginTop: 16 }}>
                {filterContent}
                {actions}
            </div>
            {results}
        </Page>
    );
}
