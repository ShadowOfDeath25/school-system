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
    const {showSnackbar, hideSnackbar} = useSnackbar();
    const normalizeData = () => {
        const result = {
            show_notes: showNotes,
            type: reportType,
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

        if (["letters", "arrears-letters"].includes(rest.reportSubType) && !rest.letter) {
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
        if (!normalizedData) {
            return;
        }
        const snackbarId = showSnackbar('جاري تحميل التقرير', "info")
        let response;
        if (['letters', 'arrears-letters'].includes(formData.reportSubType)) {
            response = await axiosClient.post(`reports/students/payments/${formData.reportSubType}`, normalizedData);
            hideSnackbar(snackbarId)

        } else {
            response = await axiosClient.get(`reports/students/payments/${formData.reportSubType}`, {params: normalizedData});
            hideSnackbar(snackbarId)
        }
        if (response.status !== 200) {
            showSnackbar(response.data.message, "error");
            return;
        }
        showPDFPreview({url: response.data.preview_url});
    }
    return (
        <>
            <form className={styles.container}>
                <h4 className={styles.title}>خيارات العرض</h4>
                <div className={styles.body}>
                    <label htmlFor={"reportType"}>نوع التقرير</label>
                    <SelectField
                        options={[...Object.values(PaymentHelper.PAYMENT_TYPES)]}
                        id={"reportType"}
                        placeholder={"اختر نوع التقرير"}
                        value={reportType}
                        handleChange={(e) => setReportType(e.target.value)}
                        name={"reportType"}
                    />
                    <Activity mode={reportType === PaymentHelper.PAYMENT_TYPES.TUITION ? "visible" : "hidden"}>
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
                            setFormData({min:0})
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

