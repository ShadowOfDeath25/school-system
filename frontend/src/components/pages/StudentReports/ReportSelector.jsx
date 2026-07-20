import SelectField from "@ui/SelectField/SelectField.jsx";

const REPORT_TYPES = [
    { label: "إحصائيات الطلاب", value: "demographics" },
    { label: "كشف الطلاب", value: "roster" },
    { label: "كشف درجات الطلاب", value: "student_marks" },
];

export default function ReportSelector({ value, onChange }) {
    return (
        <SelectField
            name={"reportType"}
            label={"اختر التقرير"}
            value={value}
            handleChange={onChange}
            options={REPORT_TYPES}
        />
    );
}
