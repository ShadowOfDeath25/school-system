const TYPES = [
    "دور اول",
    "دور ثاني"
]
const FIELDS = {
    NAME: {
        name: "name",
        label: "اسم الاختبار",
        type: "text",
        placeholder: "اسم الاختبار",
        required: true,
    },
    TYPE: {
        name: "type",
        label: "نوع الاختبار",
        type: "select",
        required: true,
        options: TYPES
    },
    DATE:{
        name: "date",
        label: "موعد الاختبار",
        type: "datetime-local",
        required: true,
    },
    DURATION_IN_HOURS: {
        name: "duration_in_hours",
        label: "المدة بالساعات",
        type: "number",
        required: true,
    },
    MIN_MARKS:{
        name: "min_marks",
        label: "الدرجة الصغري",
        type: "number",
        placeholder: 'الدرجة الصغري',
        required: true,
    },
    MAX_MARKS:{
        name: "max_marks",
        label: "الدرجة العظمي",
        type: "number",
        placeholder: 'الدرجة العظمي',
        required: true,
    },
}
export const ExamHelper = {
    TYPES,
    FIELDS,
    getALlFields:()=>{
        return Object.values(FIELDS)
    }
}
