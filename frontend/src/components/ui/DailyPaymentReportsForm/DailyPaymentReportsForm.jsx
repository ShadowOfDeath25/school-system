import styles from '../TuitionReports/styles.module.css'
import {Activity} from "react";
import SelectField from "@ui/SelectField/SelectField.jsx";
import InputField from "@ui/InputField/InputField.jsx";
import {useFilters, useGetAll} from "@hooks/api/useCrud.js";

export default function DailyPaymentReportsForm({formData, setFormData, academicYears, reportSubType}) {

    const {data: recipients} = useGetAll('recipients', {}, {
        select: (data) => data?.map((recipient) => ({label: recipient.name, value: recipient.id}))
    })

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
                value={formData.date}
                handleChange={handleChange}
                name={"date"}
            />
            <SelectField
                label={"المستلم"}
                options={recipients}
                name={"recipient_id"}
                placeholder={"اختر المستلم"}
                value={formData.recipient_id}
                handleChange={handleChange}
            />
        </div>
    );
}

