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

const NOTE_FILTER_OPTIONS = [
    { value: "", label: "الكل" },
    { value: "لا يوجد", label: "لا يوجد" },
    { value: "ابناء عاملين", label: "ابناء عاملين" },
    { value: "دمج", label: "دمج" },
    { value: "يتيم", label: "يتيم" },
];

const MONTH_OPTIONS = [
    { value: "1", label: "يناير" },
    { value: "2", label: "فبراير" },
    { value: "3", label: "مارس" },
    { value: "4", label: "أبريل" },
    { value: "5", label: "مايو" },
    { value: "6", label: "يونيو" },
    { value: "7", label: "يوليو" },
    { value: "8", label: "أغسطس" },
    { value: "9", label: "سبتمبر" },
    { value: "10", label: "أكتوبر" },
    { value: "11", label: "نوفمبر" },
    { value: "12", label: "ديسمبر" },
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
        note_filter: "",
        month: "",
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
        if (!result.note_filter) delete result.note_filter;
        if (!result.month) delete result.month;
        return result;
    };

    const legacyEndpoint = reportType === "roster" ? "/reports/students/roster" : reportType === "student_stats" ? "/reports/students/stats" : reportType === "behavior_register" ? "/reports/students/behavior-register" : "/reports/students/demographics";

    const handlePrint = async () => {
        if (!formData.grade) {
            showSnackbar("يجب اختيار صف دراسي", "error");
            return;
        }
        if (reportType === "behavior_register" && !formData.month) {
            showSnackbar("يجب اختيار الشهر", "error");
            return;
        }
        const params = normalizeData();
        if (!params) return;
        try {
            if (reportType === "roster") params.export = "pdf";
            const response = await axiosClient.get(legacyEndpoint, { params });
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
        exportAsExcel(legacyEndpoint, params);
    };

    const handleReset = () => {
        setFormData({ note_filter: "" });
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
                        value={formData.classroom}
                        name={"classroom"}
                        disabled={!(formData.level && formData.grade && formData.language && formData.academic_year)}
                        options={classrooms?.data?.map((c) => ({ label: c.name, value: c.id }))}
                        handleChange={handleChange}
                    />

                    <SelectField
                        label={"علامة مميزة"}
                        options={NOTE_FILTER_OPTIONS}
                        placeholder={"اختر العلامة"}
                        value={formData.note_filter}
                        handleChange={handleChange}
                        name={"note_filter"}
                    />

                    {reportType === "behavior_register" && (
                        <SelectField
                            label={"الشهر"}
                            options={MONTH_OPTIONS}
                            placeholder={"اختر الشهر"}
                            value={formData.month}
                            handleChange={handleChange}
                            name={"month"}
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
        </Page>
    );
}
