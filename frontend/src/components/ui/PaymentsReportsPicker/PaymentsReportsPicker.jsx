import styles from './styles.module.css';
import SelectField from "@ui/SelectField/SelectField.jsx";
import {Activity, useState} from "react";
import {useGetAll} from "@hooks/api/useCrud.js";
import {usePersistedState} from "@hooks/usePersistedState.js";
import TuitionReports from "@ui/TuitionReports/TuitionReports.jsx";
import {Button, Checkbox, FormControlLabel} from "@mui/material";


export default function PaymentsReportsPicker() {
    const [reportType, setReportType] = usePersistedState("reportType", "tuition");
    const {data: academicYears = []} = useGetAll('academic-years');
    const [showNotes, setShowNotes] = useState(false);
    const [formData, setFormData] = useState({});


    const handleSubmit = () => {

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

