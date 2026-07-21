import { useState, useEffect } from "react";
import styles from "@pages/StudentReports/styles.module.css";
import Page from "@ui/Page/Page.jsx";
import SelectField from "@ui/SelectField/SelectField.jsx";
import Button from "@mui/material/Button";
import axiosClient from "../../../../axiosClient.js";
import { useGetAll } from "@hooks/api/useCrud.js";
import { usePDFPreview } from "@contexts/PDFPreviewContext.jsx";
import { useSnackbar } from "@contexts/SnackbarContext.jsx";
import { useExport } from "@hooks/useExport.js";
import { ClassroomHelper } from "@helpers/ClassroomHelper.js";
import StudentMarksTable from "@pages/StudentReports/StudentMarksTable.jsx";
import MarksReportSelector from "./MarksReportSelector.jsx";

const SEMESTER_OPTIONS = [
    { value: "both", label: "الفصلين" },
    { value: "الأول", label: "الفصل الدراسي الأول" },
    { value: "الثاني", label: "الفصل الدراسي الثاني" },
];

export default function MarksReports() {
    const [reportType, setReportType] = useState("class_marks");
    const [formData, setFormData] = useState({ semester: "both" });
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { showPDFPreview } = usePDFPreview();
    const { exportAsExcel } = useExport();
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        setReportData(null);
    }, [reportType]);

    const { data: academicYears = [] } = useGetAll("academic-years", {}, {
        select: (data) => data?.data?.map((ay) => ay.name),
    });

    const { data: classrooms } = useGetAll("classrooms", {
        all: "true",
        academic_year: formData.academic_year,
        language: formData.language === "الكل" ? null : formData.language,
        level: formData.level,
        grade: formData.grade,
    }, {
        disabled: !(formData.level && formData.grade && formData.language && formData.academic_year),
    });

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const normalizeData = () => {
        const { language, ...rest } = formData;
        const result = { ...rest };
        if (language && language !== "الكل") result.language = language;
        if (!result.academic_year) return null;
        return result;
    };

    const normalizeCertificateData = () => {
        const result = {};
        for (const key of ["academic_year", "semester", "language", "level", "grade", "classroom_id"]) {
            const val = formData[key];
            if (val !== undefined && val !== "" && val !== null && val !== "الكل") {
                result[key] = val;
            }
        }
        if (!result.academic_year) return null;
        return result;
    };

    const handleView = async () => {
        if (!formData.grade) {
            showSnackbar("يجب اختيار صف دراسي", "error");
            return;
        }
        const params = normalizeData();
        if (!params) return;
        setLoading(true);
        try {
            const response = await axiosClient.get("/reports/students/marks/class", { params });
            setReportData(response.data);
        } catch (error) {
            showSnackbar(error?.response?.data?.message || "فشل تحميل البيانات", "error");
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = async () => {
        if (!formData.grade) {
            showSnackbar("يجب اختيار صف دراسي", "error");
            return;
        }
        const params = normalizeData();
        if (!params) return;
        try {
            params.export = "pdf";
            const response = await axiosClient.get("/reports/students/marks/class", { params });
            showPDFPreview({ url: response.data.preview_url });
        } catch (error) {
            showSnackbar(error?.response?.data?.message || "فشل تحميل التقرير", "error");
        }
    };

    const handleExport = () => {
        if (!formData.grade) {
            showSnackbar("يجب اختيار صف دراسي", "error");
            return;
        }
        const params = normalizeData();
        if (!params) return;
        exportAsExcel("/reports/students/marks/class", params);
    };

    const handleSingleCertificate = async (studentId) => {
        const academicYear = formData.academic_year;
        if (!academicYear) {
            showSnackbar("يجب اختيار عام دراسي", "error");
            return;
        }
        try {
            const params = {
                academic_year: academicYear,
                semester: formData.semester || "both",
                student_id: studentId,
                export: "pdf",
            };
            const response = await axiosClient.get("/reports/students/certificates", { params });
            showPDFPreview({ url: response.data.preview_url });
        } catch (error) {
            showSnackbar(error?.response?.data?.message || "فشل تحميل الشهادة", "error");
        }
    };

    const handleViewCertificates = async () => {
        const params = normalizeCertificateData();
        if (!params) return;
        setLoading(true);
        try {
            params.export = "pdf";
            const response = await axiosClient.get("/reports/students/certificates", { params });
            showPDFPreview({ url: response.data.preview_url });
        } catch (error) {
            showSnackbar(error?.response?.data?.message || "فشل تحميل الشهادات", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({ semester: "both" });
        setReportData(null);
    };

    const showFilters = reportType === "class_marks" || reportType === "certificates";
    const isCertificates = reportType === "certificates";

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
                options={isCertificates ? ["عربي", "لغات", "الكل"] : ["عربي", "لغات"]}
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
                label={"الفصل"}
                placeholder={"اختر الفصل"}
                value={formData.classroom_id}
                name={"classroom_id"}
                disabled={!(formData.level && formData.grade && formData.language && formData.academic_year)}
                options={classrooms?.data?.map((c) => ({ label: c.name, value: c.id }))}
                handleChange={handleChange}
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

    const actions = isCertificates ? (
        <div className={styles.actions}>
            <Button variant={"contained"} color="primary" onClick={handleViewCertificates} disabled={loading}>
                {loading ? "جاري التحميل..." : "عرض الشهادات"}
            </Button>
            <Button variant={"contained"} color={"error"} onClick={handleReset}>
                اعادة تعيين
            </Button>
        </div>
    ) : (
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

    const results = reportData && reportType === "class_marks" && (
        <div className={styles.container} style={{ marginTop: 16 }}>
            <h4 className={styles.title}>
                كشف درجات الطلاب — {reportData.grade_name} — {reportData.language}
                {reportData.semester !== "both" && (
                    <> — الفصل {reportData.semester === "الأول" ? "الدراسي الأول" : "الدراسي الثاني"}</>
                )}
                {" — "}{reportData.academic_year}
            </h4>
            <p className={styles.summary}>
                إجمالي الطلاب: {reportData.totals.students_count}
                {" | "}عدد المواد: {reportData.totals.subjects_count}
            </p>
            <StudentMarksTable data={reportData} onPrintCertificate={handleSingleCertificate} />
        </div>
    );

    return (
        <Page>
            <div className={styles.container}>
                <h4 className={styles.title}>تقارير الدرجات</h4>
                <div className={styles.body}>
                    <MarksReportSelector
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                    />
                </div>
            </div>
            {showFilters && (
                <div className={styles.container} style={{ marginTop: 16 }}>
                    {filterContent}
                    {actions}
                </div>
            )}
            {results}
        </Page>
    );
}
