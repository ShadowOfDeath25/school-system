import SelectField from "@ui/SelectField/SelectField.jsx";

const REPORT_TYPES = [
    { label: "إحصائيات الطلاب", value: "demographics" },
    { label: "إحصاءات الفصول", value: "student_stats" },
    { label: "كشف الطلاب", value: "roster" },
    { label: "دفتر 5 سلوك", value: "behavior_register" },
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
