import { useState } from "react";
import styles from "./styles.module.css";
import Page from "@ui/Page/Page.jsx";
import SelectField from "@ui/SelectField/SelectField.jsx";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axiosClient from "../../../axiosClient.js";
import { useGetAll } from "@hooks/api/useCrud.js";
import { usePDFPreview } from "@contexts/PDFPreviewContext.jsx";
import { useExport } from "@hooks/useExport.js";
import { ClassroomHelper } from "@helpers/ClassroomHelper.js";
import ReportSelector from "./ReportSelector.jsx";

export default function StudentReports() {
    const [reportType, setReportType] = useState("demographics");
    const [formData, setFormData] = useState({});
    const { showPDFPreview } = usePDFPreview();
    const { exportAsExcel } = useExport();

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

    const endpoint = reportType === "roster" ? "/reports/students/roster" : "/reports/students/demographics";

    const handlePrint = async () => {
        const params = normalizeData();
        if (!params) return;
        try {
            if (reportType === "roster") params.export = "pdf";
            const response = await axiosClient.get(endpoint, { params });
            showPDFPreview({ url: response.data.preview_url });
        } catch {
        }
    };

    const handleExport = () => {
        const params = normalizeData();
        if (!params) return;
        exportAsExcel(endpoint, params);
    };

    const handleReset = () => {
        setFormData({});
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
                    <Button variant={"contained"} onClick={handlePrint}>
                        طباعة
                    </Button>
                    <Button variant={"contained"} color={"success"} onClick={handleExport}>
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
