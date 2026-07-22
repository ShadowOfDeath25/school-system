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
import TopStudentsTable from "./TopStudentsTable.jsx";
import ClassroomStatisticsTable from "./ClassroomStatisticsTable.jsx";
import MarksReportSelector from "./MarksReportSelector.jsx";

const SEMESTER_OPTIONS = [
    { value: "both", label: "الفصلين" },
    { value: "الأول", label: "الفصل الدراسي الأول" },
    { value: "الثاني", label: "الفصل الدراسي الثاني" },
];

const FINAL_EXAM_SEMESTER_OPTIONS = [
    { value: "الأول", label: "الفصل الدراسي الأول" },
    { value: "الثاني", label: "الفصل الدراسي الثاني" },
];

const SCORE_FILTER_OPTIONS = [
    { value: "", label: "الكل" },
    { value: "85+", label: "85% فأكثر" },
    { value: "65+", label: "65% فأكثر" },
    { value: "50+", label: "50% فأكثر" },
    { value: "below_50", label: "أقل من 50%" },
];

const NOTE_FILTER_OPTIONS = [
    { value: "", label: "الكل" },
    { value: "لا يوجد", label: "لا يوجد" },
    { value: "ابناء عاملين", label: "ابناء عاملين" },
    { value: "دمج", label: "دمج" },
    { value: "يتيم", label: "يتيم" },
];

export default function MarksReports() {
    const [reportType, setReportType] = useState("class_marks");
    const [formData, setFormData] = useState({ semester: "both", score_filter: "", note_filter: "" });
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { showPDFPreview } = usePDFPreview();
    const { exportAsExcel } = useExport();
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        setReportData(null);
        if ((reportType === "final_exam_marks" || reportType === "year_work_marks" || reportType === "classroom_statistics") && formData.semester === "both") {
            setFormData((prev) => ({ ...prev, semester: "الأول" }));
        }
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
        if (!result.score_filter) delete result.score_filter;
        if (!result.note_filter) delete result.note_filter;
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
        if (isDetailed) params.detailed = 1;
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
        if (isDetailed) params.detailed = 1;
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
        if (isDetailed) params.detailed = 1;
        exportAsExcel("/reports/students/marks/class", params);
    };

    const handleViewFinalExam = async () => {
        if (!formData.grade) {
            showSnackbar("يجب اختيار صف دراسي", "error");
            return;
        }
        if (!formData.semester || formData.semester === "both") {
            showSnackbar("يجب اختيار فصل دراسي محدد", "error");
            return;
        }
        const params = normalizeData();
        if (!params) return;
        setLoading(true);
        try {
            const response = await axiosClient.get("/reports/students/marks/final-exam", { params });
            setReportData(response.data);
        } catch (error) {
            showSnackbar(error?.response?.data?.message || "فشل تحميل البيانات", "error");
        } finally {
            setLoading(false);
        }
    };

    const handlePrintFinalExam = async () => {
        if (!formData.grade) {
            showSnackbar("يجب اختيار صف دراسي", "error");
            return;
        }
        if (!formData.semester || formData.semester === "both") {
            showSnackbar("يجب اختيار فصل دراسي محدد", "error");
            return;
        }
        const params = normalizeData();
        if (!params) return;
        try {
            params.export = "pdf";
            const response = await axiosClient.get("/reports/students/marks/final-exam", { params });
            showPDFPreview({ url: response.data.preview_url });
        } catch (error) {
            showSnackbar(error?.response?.data?.message || "فشل تحميل التقرير", "error");
        }
    };

    const handleExportFinalExam = () => {
        if (!formData.grade) {
            showSnackbar("يجب اختيار صف دراسي", "error");
            return;
        }
        if (!formData.semester || formData.semester === "both") {
            showSnackbar("يجب اختيار فصل دراسي محدد", "error");
            return;
        }
        const params = normalizeData();
        if (!params) return;
        exportAsExcel("/reports/students/marks/final-exam", params);
    };

    const handleViewYearWork = async () => {
        if (!formData.grade) {
            showSnackbar("يجب اختيار صف دراسي", "error");
            return;
        }
        if (!formData.semester || formData.semester === "both") {
            showSnackbar("يجب اختيار فصل دراسي محدد", "error");
            return;
        }
        const params = normalizeData();
        if (!params) return;
        setLoading(true);
        try {
            const response = await axiosClient.get("/reports/students/marks/year-work", { params });
            setReportData(response.data);
        } catch (error) {
            showSnackbar(error?.response?.data?.message || "فشل تحميل البيانات", "error");
        } finally {
            setLoading(false);
        }
    };

    const handlePrintYearWork = async () => {
        if (!formData.grade) {
            showSnackbar("يجب اختيار صف دراسي", "error");
            return;
        }
        if (!formData.semester || formData.semester === "both") {
            showSnackbar("يجب اختيار فصل دراسي محدد", "error");
            return;
        }
        const params = normalizeData();
        if (!params) return;
        try {
            params.export = "pdf";
            const response = await axiosClient.get("/reports/students/marks/year-work", { params });
            showPDFPreview({ url: response.data.preview_url });
        } catch (error) {
            showSnackbar(error?.response?.data?.message || "فشل تحميل التقرير", "error");
        }
    };

    const handleExportYearWork = () => {
        if (!formData.grade) {
            showSnackbar("يجب اختيار صف دراسي", "error");
            return;
        }
        if (!formData.semester || formData.semester === "both") {
            showSnackbar("يجب اختيار فصل دراسي محدد", "error");
            return;
        }
        const params = normalizeData();
        if (!params) return;
        exportAsExcel("/reports/students/marks/year-work", params);
    };

    const handleViewClassroomStats = async () => {
        if (!formData.grade) {
            showSnackbar("يجب اختيار صف دراسي", "error");
            return;
        }
        if (!formData.semester || formData.semester === "both") {
            showSnackbar("يجب اختيار فصل دراسي محدد", "error");
            return;
        }
        const params = normalizeData();
        if (!params) return;
        setLoading(true);
        try {
            const response = await axiosClient.get("/reports/students/marks/classroom-statistics", { params });
            setReportData(response.data);
        } catch (error) {
            showSnackbar(error?.response?.data?.message || "فشل تحميل البيانات", "error");
        } finally {
            setLoading(false);
        }
    };

    const handlePrintClassroomStats = async () => {
        if (!formData.grade) {
            showSnackbar("يجب اختيار صف دراسي", "error");
            return;
        }
        if (!formData.semester || formData.semester === "both") {
            showSnackbar("يجب اختيار فصل دراسي محدد", "error");
            return;
        }
        const params = normalizeData();
        if (!params) return;
        try {
            params.export = "pdf";
            const response = await axiosClient.get("/reports/students/marks/classroom-statistics", { params });
            showPDFPreview({ url: response.data.preview_url });
        } catch (error) {
            showSnackbar(error?.response?.data?.message || "فشل تحميل التقرير", "error");
        }
    };

    const handleExportClassroomStats = () => {
        if (!formData.grade) {
            showSnackbar("يجب اختيار صف دراسي", "error");
            return;
        }
        if (!formData.semester || formData.semester === "both") {
            showSnackbar("يجب اختيار فصل دراسي محدد", "error");
            return;
        }
        const params = normalizeData();
        if (!params) return;
        exportAsExcel("/reports/students/marks/classroom-statistics", params);
    };

    const handleViewTopStudents = async () => {
        const params = normalizeData();
        if (!params) return;
        setLoading(true);
        try {
            const response = await axiosClient.get("/reports/students/marks/top-students", { params });
            setReportData(response.data);
        } catch (error) {
            showSnackbar(error?.response?.data?.message || "فشل تحميل البيانات", "error");
        } finally {
            setLoading(false);
        }
    };

    const handlePrintTopStudents = async () => {
        const params = normalizeData();
        if (!params) return;
        try {
            params.export = "pdf";
            const response = await axiosClient.get("/reports/students/marks/top-students", { params });
            showPDFPreview({ url: response.data.preview_url });
        } catch (error) {
            showSnackbar(error?.response?.data?.message || "فشل تحميل التقرير", "error");
        }
    };

    const handleExportTopStudents = () => {
        const params = normalizeData();
        if (!params) return;
        exportAsExcel("/reports/students/marks/top-students", params);
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
        setFormData({ semester: isSingleSemester ? "الأول" : "both", score_filter: "", note_filter: "" });
        setReportData(null);
    };

    const showFilters = reportType === "class_marks" || reportType === "class_marks_detailed" || reportType === "certificates" || reportType === "top_students" || reportType === "final_exam_marks" || reportType === "year_work_marks" || reportType === "classroom_statistics";
    const isCertificates = reportType === "certificates";
    const isDetailed = reportType === "class_marks_detailed";
    const isTopStudents = reportType === "top_students";
    const isFinalExam = reportType === "final_exam_marks";
    const isYearWork = reportType === "year_work_marks";
    const isClassroomStats = reportType === "classroom_statistics";
    const isSingleSemester = isFinalExam || isYearWork || isClassroomStats;

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
            {!isTopStudents && !isClassroomStats && (
                <SelectField
                    label={"الفصل"}
                    placeholder={"اختر الفصل"}
                    value={formData.classroom_id}
                    name={"classroom_id"}
                    disabled={!(formData.level && formData.grade && formData.language && formData.academic_year)}
                    options={classrooms?.data?.map((c) => ({ label: c.name, value: c.id }))}
                    handleChange={handleChange}
                />
            )}
            {!isTopStudents && !isCertificates && !isClassroomStats && (
                <SelectField
                    label={"نسبة النجاح"}
                    options={SCORE_FILTER_OPTIONS}
                    placeholder={"اختر النسبة"}
                    value={formData.score_filter}
                    handleChange={handleChange}
                    name={"score_filter"}
                />
            )}
            {!isTopStudents && !isCertificates && !isClassroomStats && (
                <SelectField
                    label={"علامة مميزة"}
                    options={NOTE_FILTER_OPTIONS}
                    placeholder={"اختر العلامة"}
                    value={formData.note_filter}
                    handleChange={handleChange}
                    name={"note_filter"}
                />
            )}
            <SelectField
                label={"الفصل الدراسي"}
                options={isSingleSemester ? FINAL_EXAM_SEMESTER_OPTIONS : SEMESTER_OPTIONS}
                placeholder={"اختر الفصل الدراسي"}
                value={isSingleSemester && formData.semester === "both" ? "" : formData.semester}
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
    ) : isFinalExam ? (
        <div className={styles.actions}>
            <Button variant={"contained"} color="primary" onClick={handleViewFinalExam} disabled={loading}>
                {loading ? "جاري التحميل..." : "عرض"}
            </Button>
            <Button variant={"contained"} color="primary" onClick={handlePrintFinalExam}>
                طباعة
            </Button>
            <Button variant="outlined" color="primary" onClick={handleExportFinalExam}>
                تصدير ك EXCEL
            </Button>
            <Button variant={"contained"} color={"error"} onClick={handleReset}>
                اعادة تعيين
            </Button>
        </div>
    ) : isYearWork ? (
        <div className={styles.actions}>
            <Button variant={"contained"} color="primary" onClick={handleViewYearWork} disabled={loading}>
                {loading ? "جاري التحميل..." : "عرض"}
            </Button>
            <Button variant={"contained"} color="primary" onClick={handlePrintYearWork}>
                طباعة
            </Button>
            <Button variant="outlined" color="primary" onClick={handleExportYearWork}>
                تصدير ك EXCEL
            </Button>
            <Button variant={"contained"} color={"error"} onClick={handleReset}>
                اعادة تعيين
            </Button>
        </div>
    ) : isClassroomStats ? (
        <div className={styles.actions}>
            <Button variant={"contained"} color="primary" onClick={handleViewClassroomStats} disabled={loading}>
                {loading ? "جاري التحميل..." : "عرض"}
            </Button>
            <Button variant={"contained"} color="primary" onClick={handlePrintClassroomStats}>
                طباعة
            </Button>
            <Button variant="outlined" color="primary" onClick={handleExportClassroomStats}>
                تصدير ك EXCEL
            </Button>
            <Button variant={"contained"} color={"error"} onClick={handleReset}>
                اعادة تعيين
            </Button>
        </div>
    ) : isTopStudents ? (
        <div className={styles.actions}>
            <Button variant={"contained"} color="primary" onClick={handleViewTopStudents} disabled={loading}>
                {loading ? "جاري التحميل..." : "عرض"}
            </Button>
            <Button variant={"contained"} color="primary" onClick={handlePrintTopStudents}>
                طباعة
            </Button>
            <Button variant="outlined" color="primary" onClick={handleExportTopStudents}>
                تصدير ك EXCEL
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

    const getTitle = () => {
        if (isFinalExam) return "نتائج امتحانات نهاية الفصل";
        if (isYearWork) return "كشف اعمال السنة";
        return "كشف درجات الطلاب";
    };

    const results = reportData && (reportType === "class_marks" || reportType === "class_marks_detailed" || isFinalExam || isYearWork) && (
        <div className={styles.container} style={{ marginTop: 16 }}>
            <h4 className={styles.title}>
                {getTitle()} — {reportData.grade_name} — {reportData.language}
                {reportData.semester !== "both" && (
                    <> — الفصل {reportData.semester === "الأول" ? "الدراسي الأول" : "الدراسي الثاني"}</>
                )}
                {" — "}{reportData.academic_year}
            </h4>
            <p className={styles.summary}>
                إجمالي الطلاب: {reportData.totals.students_count}
                {" | "}عدد المواد: {reportData.totals.subjects_count}
            </p>
            <StudentMarksTable data={reportData} detailed={true} onPrintCertificate={handleSingleCertificate} />
        </div>
    );

    const classroomStatsResults = reportData && isClassroomStats && (
        <div className={styles.container} style={{ marginTop: 16 }}>
            <h4 className={styles.title}>
                احصائيات الفصول — {reportData.grade_name} — {reportData.language}
                — الفصل {reportData.semester === "الأول" ? "الدراسي الأول" : "الدراسي الثاني"}
                {" — "}{reportData.academic_year}
            </h4>
            <p className={styles.summary}>
                عدد الفصول: {reportData.totals.classrooms_count}
                {" | "}عدد المواد: {reportData.totals.subjects_count}
            </p>
            <ClassroomStatisticsTable data={reportData} />
        </div>
    );

    const topStudentsResults = reportData && isTopStudents && (
        <div className={styles.container} style={{ marginTop: 16 }}>
            <h4 className={styles.title}>
                أوائل الطلاب — {reportData.level} — {reportData.language}
                {reportData.semester !== "both" && (
                    <> — الفصل {reportData.semester === "الأول" ? "الدراسي الأول" : "الدراسي الثاني"}</>
                )}
                {" — "}{reportData.academic_year}
            </h4>
            <TopStudentsTable data={reportData} />
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
            {classroomStatsResults}
            {topStudentsResults}
        </Page>
    );
}
