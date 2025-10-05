import {getAcademicYears} from "@utils/getAcademicYears.js";

const LEVELS = [
    'رياض اطفال',
    'ابتدائي',
    'اعدادي'
];

const LANGUAGES = [
    'لغات',
    "عربي"
];

const GRADES = {
    "رياض اطفال": [
        {label: "الأول", value: 1},
        {label: "الثاني", value: 2},
    ],
    "ابتدائي": [
        {label: "الاول", value: 1},
        {label: "الثاني", value: 2},
        {label: "الثالث", value: 3},
        {label: "الرابع", value: 4},
        {label: "الخامس", value: 5},
        {label: "السادس", value: 6},
    ],
    "اعدادي": [
        {label: "الأول", value: 1},
        {label: "الثاني", value: 2},
        {label: "الثالث", value: 3},
    ],
};

const FIELDS = {
    LEVEL: {
        name: "level",
        label: "المرحلة",
        placeholder: "اختر مرحلة",
        type: "select",
        required: true,
        options: LEVELS
    },
    LANGUAGE: {
        name: "language",
        label: "اللغة",
        placeholder: "اختر اللغة",
        type: "radio",
        required: true,
        options: LANGUAGES
    },
    ACADEMIC_YEAR: {
        name: "academic_year",
        label: "العام الدراسي",
        placeholder: "اختر العام الدراسي",
        type: "select",
        required: true,
        options: getAcademicYears()
    },
    MAX_CAPACITY: {
        name: "max_capacity",
        type: "number",
        required: true,
        placeholder: "الطاقة الاستيعابية",
        label: "الطاقة الاستيعابية"
    },
    GRADE: {
        name: "grade",
        placeholder: "اختر الصف",
        label: "الصف",
        type: "select",
        required: true,
        options: (value) => ClassroomHelper.getGradeOptionsByLevel(value),
        disabled: (value) => !value,
        dependency: 'level'
    },
    LEADER: {
        name: "leader",
        placeholder: "رائد الفصل",
        type: "text",
        required: false,
        label: "رائد الفصل"
    },
    CLASSROOM: {
        name: "classroom",
        type: "select",
        multiple: true,
        placeholder: "اختر الفصل",
        label: "الفصل",
        disabled: (values) => values.some(value => !value),


        dependency: ["classroom.grade", "classroom.level"]
    }
};

export const ClassroomHelper = {
    LEVELS,
    LANGUAGES,
    GRADES,
    FIELDS,


    getGradeOptionsByLevel: (arg) => {
        let level;
        if (typeof arg === 'string') {
            level = arg;
        } else if (typeof arg === 'object' && arg !== null) {
            level = arg.LEVEL;
        }

        return GRADES[level] || [];
    },
    getAllFields: () => {
        return Object.values(FIELDS)
    }
};
