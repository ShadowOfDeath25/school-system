import SelectField from "@ui/SelectField/SelectField.jsx";

const MARKS_REPORT_TYPES = [
    { label: "كشف درجات الطلاب", value: "class_marks" },
    { label: "كشف درجات الطلاب (تفصيلي)", value: "class_marks_detailed" },
    { label: "نتائج الامتحان النهائي", value: "final_exam_marks" },
    { label: "كشف اعمال السنة", value: "year_work_marks" },
    { label: "احصائيات الفصول", value: "classroom_statistics" },
    { label: "أوائل الطلاب", value: "top_students" },
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
