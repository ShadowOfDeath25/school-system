import { useState } from "react";
import Page from "@ui/Page/Page.jsx";
import SelectField from "@ui/SelectField/SelectField.jsx";
import Button from "@mui/material/Button";
import axiosClient from "../../../axiosClient.js";
import { useGetAll } from "@hooks/api/useCrud.js";
import { usePDFPreview } from "@contexts/PDFPreviewContext.jsx";
import { useExport } from "@hooks/useExport.js";
import { ClassroomHelper } from "@helpers/ClassroomHelper.js";
import styles from "./styles.module.css";

const REPORT_TYPES = [
    { label: "كشف إحصائي للجان", value: "summary" },
];

const ENDPOINTS = {
    summary: "/reports/students/exam-candidates-summary",
};

export default function ExamHallSummary() {
    const [formData, setFormData] = useState({});
    const { showPDFPreview } = usePDFPreview();
    const { exportAsExcel } = useExport();

    const { data: academicYears = [] } = useGetAll("academic-years", {}, {
        select: (data) => data?.data?.map((ay) => ay.name),
    });

    const reportType = formData.report_type || REPORT_TYPES[0].value;
    const endpoint = ENDPOINTS[reportType];

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const normalizeData = () => {
        const { report_type, ...rest } = formData;
        return { ...rest };
    };

    const handlePrint = async () => {
        const params = { ...normalizeData(), export: "pdf" };
        if (!params.academic_year) return;
        try {
            const response = await axiosClient.get(endpoint, { params });
            showPDFPreview({ url: response.data.preview_url });
        } catch {}
    };

    const handleExport = () => {
        const params = normalizeData();
        if (!params.academic_year) return;
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
                    <SelectField
                        label={"نوع التقرير"}
                        options={REPORT_TYPES.map((r) => r.label)}
                        placeholder={"اختر نوع التقرير"}
                        value={REPORT_TYPES.find((r) => r.value === reportType)?.label}
                        handleChange={(e) => {
                            const selected = REPORT_TYPES.find((r) => r.label === e.target.value);
                            setFormData((prev) => ({ ...prev, report_type: selected?.value }));
                        }}
                        name={"report_type"}
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
                        {...ClassroomHelper.FIELDS.LANGUAGE}
                        value={formData.language}
                        handleChange={handleChange}
                        name={"language"}
                    />
                </div>
                <div className={styles.actions}>
                    <Button variant={"contained"} color={"primary"} onClick={handlePrint} disabled={!formData.academic_year}>
                        طباعة
                    </Button>
                    <Button variant={"outlined"} color={"primary"} onClick={handleExport} disabled={!formData.academic_year}>
                        اكسل
                    </Button>
                    <Button variant={"contained"} color={"error"} onClick={handleReset}>
                        إعادة تعيين
                    </Button>
                </div>
            </div>
        </Page>
    );
}
