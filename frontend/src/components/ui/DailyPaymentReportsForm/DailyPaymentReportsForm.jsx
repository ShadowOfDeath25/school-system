import styles from '../TuitionReports/styles.module.css'
import {Activity} from "react";
import SelectField from "@ui/SelectField/SelectField.jsx";
import InputField from "@ui/InputField/InputField.jsx";

export default function DailyPaymentReportsForm({formData, setFormData, academicYears, reportSubType}) {
    const handleChange = (e) => {
        setFormData((prev) => ({...prev, [e.target.name]: e.target.value}))
    }
    return (
        <div className={styles.container}>
            <SelectField
                label={"العام الدراسي"}
                options={academicYears}
                placeholder={"اختر العام الدراسي"}
                value={formData.academic_year}
                handleChange={handleChange}
                name={"academic_year"}
            />
            <InputField
                label={"اليوم"}
                type={"date"}
                placeholder={"اختر اللغة"}
                value={formData.language}
                handleChange={handleChange}
                name={"date"}
            />

        </div>
    );
}

