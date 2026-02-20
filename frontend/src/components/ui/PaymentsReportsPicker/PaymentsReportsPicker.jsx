import styles from './styles.module.css';
import SelectField from "@ui/SelectField/SelectField.jsx";
import {Activity, useState} from "react";
import {useGetAll} from "@hooks/api/useCrud.js";
import {usePersistedState} from "@hooks/usePersistedState.js";
import TuitionReports from "@ui/TuitionReports/TuitionReports.jsx";
import {Button, Checkbox, FormControlLabel} from "@mui/material";
import axiosClient from "../../../axiosClient.js";
import {PaymentHelper} from "@helpers/PaymentHelper.js";
import {usePDFPreview} from "@contexts/PDFPreviewContext.jsx";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";


export default function PaymentsReportsPicker() {
    const [reportType, setReportType] = usePersistedState("reportType", "tuition");
    const {data: academicYears = []} = useGetAll('academic-years');
    const [showNotes, setShowNotes] = useState(false);
    const [formData, setFormData] = useState({});
    const {showPDFPreview} = usePDFPreview();
    const {showSnackbar} = useSnackbar();
    const normalizeData = () => {
        const result = {
            show_notes: showNotes,
            type: PaymentHelper.PAYMENT_TYPES[reportType],
        };
        let isValid = true;
        const {sorting, language, ...rest} = formData;
        if (sorting !== "الكل") {
            result.sorting = sorting;
        }
        if (language !== "الكل") {
            result.language = language;
        }
        if (!rest.reportSubType) {
            showSnackbar("يرجي اختيار تقرير", "error")
            return {};
        }

        if (["letters", "arrears-letters"].includes(rest.reportSubType) && !rest.letter ) {
            showSnackbar("يرجي كتابة خطاب", "error")
            isValid = false;
        }
        if (!rest.academic_year) {
            showSnackbar("يرجي اختيار سنة دراسية", "error")
            isValid = false;
        }
        return isValid ?
            {
                ...result,
                ...rest
            } : {}

    }
    const handleSubmit = async () => {
        const normalizedData = normalizeData();
        console.log(normalizedData);
        if (normalizedData === {}) {
            return;
        }
        const response = await axiosClient.post(`reports/students/payments/${formData.reportSubType}`, normalizedData);
        showPDFPreview({url: response.data.preview_url});
    }
    return (
        <>
            <form className={styles.container}>
                <h4 className={styles.title}>خيارات العرض</h4>
                <div className={styles.body}>
                    <label htmlFor={"reportType"}>نوع التقرير</label>
                    <SelectField
                        options={[
                            {
                                label: "المصروفات الدراسية",
                                value: "tuition"
                            },
                            {
                                label: "المصروفات الادارية",
                                value: "administrative"
                            },
                            {
                                label: "مصروفات الكتب",
                                value: "books"
                            },
                            {
                                label: "المستحقات الاضافية",
                                value: "extra-dues"
                            },
                            {
                                label: "الاعفائات",
                                value: "exemptions"
                            },
                            {
                                label: "مصروفات ادارية من سحب الملفات",
                                value: "withdrawals"
                            },
                            {
                                label: "مصروفات الزي",
                                value: "uniforms"
                            }
                        ]
                        }
                        id={"reportType"}
                        placeholder={"اختر نوع التقرير"}
                        value={reportType}
                        handleChange={(e) => setReportType(e.target.value)}
                        name={"reportType"}
                    />
                    <Activity mode={reportType === "tuition" ? "visible" : "hidden"}>
                        <TuitionReports
                            formData={formData}
                            setFormData={setFormData}
                            academicYears={academicYears}
                        />
                    </Activity>


                    <label>خيارات اخري</label>
                    <FormControlLabel
                        control={<Checkbox sx={{color: "var(--primary-text-color)"}}/>}
                        label={"عرض العلامات المميزة"}
                        sx={{color: "var(--primary-text-color)"}}
                        value={showNotes}
                        onChange={() => setShowNotes(!showNotes)}
                    />
                </div>
                <div className={styles.actions}>
                    <Button
                        variant={"contained"}
                        onClick={handleSubmit}
                    >
                        طباعة
                    </Button>
                    <Button
                        variant={"contained"}
                        color={"error"}
                        onClick={() => {
                            setFormData({})
                        }}
                    >
                        اعادة تعيين
                    </Button>
                </div>
            </form>
        </>
    )
        ;
}

