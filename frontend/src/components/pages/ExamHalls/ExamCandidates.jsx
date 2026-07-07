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

export default function ExamCandidates() {
    const [formData, setFormData] = useState({});
    const { showPDFPreview } = usePDFPreview();
    const { exportAsExcel } = useExport();

    const { data: academicYears = [] } = useGetAll("academic-years", {}, {
        select: (data) => data?.data?.map((ay) => ay.name),
    });

    const endpoint = "/reports/students/exam-candidates";

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePrint = async () => {
        const params = { ...formData, export: "pdf" };
        if (!params.academic_year) return;
        try {
            const response = await axiosClient.get(endpoint, { params });
            showPDFPreview({ url: response.data.preview_url });
        } catch {}
    };

    const handleExport = () => {
        const params = { ...formData };
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
                    <Button variant={"contained"} onClick={handlePrint} disabled={!formData.academic_year}>
                        طباعة
                    </Button>
                    <Button variant={"contained"} color={"success"} onClick={handleExport} disabled={!formData.academic_year}>
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
