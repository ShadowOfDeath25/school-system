import SelectField from "@ui/SelectField/SelectField.jsx";

const MARKS_REPORT_TYPES = [
    { label: "كشف درجات الطلاب", value: "class_marks" },
    { label: "شهادات الطلبة", value: "certificates" },
];

export default function MarksReportSelector({ value, onChange }) {
    return (
        <SelectField
            name={"reportType"}
            label={"اختر التقرير"}
            value={value}
            handleChange={onChange}
            options={MARKS_REPORT_TYPES}
        />
    );
}
