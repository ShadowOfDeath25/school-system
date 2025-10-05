const SEMESTERS = [
    'الاول',
    'الثاني',
    'طوال العام'
]

const FIELDS = {
    TYPE: {
        name: "type",
        label: "نوع المادة",
        type: "select",
        placeholder: "اختر نوع المادة",
        required: true,

    },
    SEMESTER: {
        name: "semester",
        type: "select",
        label: "الفصل الدراسي",
        options: SEMESTERS,
        required: true,
        placeholder: "اختر الفصل الدراسي"
    },
    NAME: {
        name: "name",
        type: "text",
        label: "اسم المادة",
        placeholder: "اسم المادة",
        required: true
    },
    MAX_MARKS:{
        name: "max_marks",
        type: "number",
        label: "الدرجة العظمي",
        placeholder: "الدرجة العظمي",
        required: true
    },
    MIN_MARKS: {
        name: "min_marks",
        type: "number",
        label: "الدرجة الصغري",
        placeholder: "الدرجة الصغري",
        required: true
    },
    ADDED_TO_REPORT:{
        name: "added_to_report",
        type: "radio",
        required: true,
        options: [{label: "نعم", value: 1}, {label: "لا", value: 0}],
        label: "تضاف للكشف"
    },
    ADDED_TO_TOTAL:{
        name: "added_to_total",
        type: "radio",
        required: true,
        options: [{label: "نعم", value: 1}, {label: "لا", value: 0}],
        label: "تضاف للمجموع"
    },
}


export const SubjectHelper = {
    SEMESTERS,
    FIELDS
}
