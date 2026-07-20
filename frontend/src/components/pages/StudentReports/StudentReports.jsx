import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./styles.module.css";
import Page from "@ui/Page/Page.jsx";
import SelectField from "@ui/SelectField/SelectField.jsx";
import Button from "@mui/material/Button";
import axiosClient from "../../../axiosClient.js";
import { useGetAll } from "@hooks/api/useCrud.js";
import { usePDFPreview } from "@contexts/PDFPreviewContext.jsx";
import { useSnackbar } from "@contexts/SnackbarContext.jsx";
import { useExport } from "@hooks/useExport.js";
import { ClassroomHelper } from "@helpers/ClassroomHelper.js";
import ReportSelector from "./ReportSelector.jsx";
import StudentMarksTable from "./StudentMarksTable.jsx";

const SEMESTER_OPTIONS = [
    { value: "both", label: "الفصلين" },
    { value: "الأول", label: "الفصل الدراسي الأول" },
    { value: "الثاني", label: "الفصل الدراسي الثاني" },
];

export default function StudentReports() {
    const [searchParams] = useSearchParams();
    const urlType = searchParams.get("type");
    const urlGrade = searchParams.get("grade");
    const urlLanguage = searchParams.get("language");
    const [reportType, setReportType] = useState(urlType || "demographics");
    const [formData, setFormData] = useState({
        grade: urlGrade || "",
        language: urlLanguage || "",
        semester: "both",
    });
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
        if (language) result.language = language;
        if (!result.academic_year) return null;
        return result;
    };

    const isMarksReport = reportType === "student_marks";
    const legacyEndpoint = reportType === "roster" ? "/reports/students/roster" : "/reports/students/demographics";

    const handleView = async () => {
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
        if (isMarksReport) {
            const params = normalizeData();
            if (!params) return;
            try {
                params.export = "pdf";
                const response = await axiosClient.get("/reports/students/marks/class", { params });
                showPDFPreview({ url: response.data.preview_url });
            } catch (error) {
                showSnackbar(error?.response?.data?.message || "فشل تحميل التقرير", "error");
            }
        } else {
            const params = normalizeData();
            if (!params) return;
            try {
                if (reportType === "roster") params.export = "pdf";
                const response = await axiosClient.get(legacyEndpoint, { params });
                showPDFPreview({ url: response.data.preview_url });
            } catch (error) {
                showSnackbar(error?.response?.data?.message || "فشل تحميل التقرير", "error");
            }
        }
    };

    const handleExport = () => {
        const params = normalizeData();
        if (!params) return;
        if (isMarksReport) {
            exportAsExcel("/reports/students/marks/class", params);
        } else {
            exportAsExcel(legacyEndpoint, params);
        }
    };

    const handleReset = () => {
        setFormData({ semester: "both" });
        setReportData(null);
    };

    return (
        <Page>
            <div className={styles.container}>
                <h4 className={styles.title}>خيارات العرض</h4>
                <div className={styles.body}>
                    <ReportSelector
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                    />

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
                        options={["عربي", "لغات", "الكل"]}
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

                    {isMarksReport && (
                        <SelectField
                            label={"الفصل الدراسي"}
                            options={SEMESTER_OPTIONS}
                            placeholder={"اختر الفصل الدراسي"}
                            value={formData.semester}
                            handleChange={handleChange}
                            name={"semester"}
                        />
                    )}

                    {reportType === "roster" && (
                        <>
                            <SelectField
                                label={"الحالة"}
                                options={[
                                    { label: "الكل", value: "" },
                                    { label: "مستجد", value: "مستجد" },
                                    { label: "مقيد", value: "مقيد" },
                                ]}
                                placeholder={"الحالة"}
                                value={formData.status ?? ""}
                                handleChange={handleChange}
                                name={"status"}
                            />
                            <SelectField
                                label={"الديانة"}
                                options={[
                                    { label: "الكل", value: "" },
                                    { label: "مسلم", value: "مسلم" },
                                    { label: "مسيحي", value: "مسيحي" },
                                ]}
                                placeholder={"الديانة"}
                                value={formData.religion ?? ""}
                                handleChange={handleChange}
                                name={"religion"}
                            />
                            <SelectField
                                label={"النوع"}
                                options={[
                                    { label: "الكل", value: "" },
                                    { label: "ذكر", value: "male" },
                                    { label: "انثى", value: "female" },
                                ]}
                                placeholder={"النوع"}
                                value={formData.gender ?? ""}
                                handleChange={handleChange}
                                name={"gender"}
                            />
                        </>
                    )}
                </div>

                <div className={styles.actions}>
                    {isMarksReport && (
                        <Button variant={"contained"} color="primary" onClick={handleView} disabled={loading}>
                            {loading ? "جاري التحميل..." : "عرض"}
                        </Button>
                    )}
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
            </div>

            {reportData && (
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
                    <StudentMarksTable data={reportData} />
                </div>
            )}
        </Page>
    );
}
