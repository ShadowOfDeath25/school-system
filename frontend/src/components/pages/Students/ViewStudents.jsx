import Page from "@ui/Page/Page.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import {useState} from "react";
import Table from "@ui/Table/Table.jsx";
import {useTranslation} from "react-i18next";
import {validator} from "@utils/validator.js";
import {useGetAll} from "@hooks/api/useCrud.js";
import {value} from "loadsh/seq.js";

export default function ViewStudents() {
    const [tableFilters, setTableFilters] = useState(null);
    const {data: classrooms} = useGetAll("classrooms");

    const fields = [
        {name: 'name_in_arabic'}, {name: 'father_name'}, {name: 'mother_name'}, {name: "classroom"}, {name: "note"},
    ]
    const editFields =
        [
            {
                title: "بيانات التلميذ",
                fields: [
                    {
                        name: "name_in_arabic",
                        type: "text",
                        id: "student_name_in_arabic",
                        label: "الاسم",
                        placeholder: "الاسم باللغة العربية",
                        required: true
                    },
                    {
                        name: "birth_date",
                        type: "date",
                        id: "birth_date",
                        label: "تاريخ الميلاد",
                        required: true,
                    },
                    {
                        name: "nid",
                        type: "text",
                        id: "nid",
                        label: "الرقم القومي",
                        placeholder: "الرقم القومي",
                        required: true,
                        validator: validator.students.nid,
                        error: "هذا الرقم القومي غير صحيح"
                    },
                    {
                        name: "birth_address",
                        type: "text",
                        id: "birth_address",
                        label: "جهة الميلاد",
                        required: true,
                        placeholder: 'جهة الميلاد'
                    },
                    {
                        name: "name_in_english",
                        type: "text",
                        id: "name_in_english",
                        label: "الاسم باللغة الانجليزية",
                        required: true,
                        placeholder: 'الاسم باللغة الانجليزية'
                    },
                    {
                        name: "nationality",
                        type: "radio",
                        id: "nationality",
                        label: "الجنسية",
                        required: true,
                        placeholder: "الجنسية",
                        options: [{label: "مصري", value: "مصري"}, {label: "اجنبي", value: "اجنبي"}]
                    },
                    {
                        name: "gender",
                        type: "radio",
                        id: "gender",
                        label: "النوع",
                        required: true,
                        options: [{label: "ذكر", value: "male"}, {label: "أنثى", value: "female"}],
                        error: "الرجاء اختيار النوع"
                    },
                    {
                        name: "religion",
                        type: "radio",
                        id: "religion",
                        label: "الديانة",
                        options: [
                            {label: "مسلم", value: "مسلم"},
                            {label: "مسيحي", value: "مسيحي"}
                        ]
                    },
                    {
                        name: "note",
                        type: "select",
                        label: "علامة مميزة",
                        options: [
                            {label: "لا يوجد", value: null},
                            {label: "ابناء عاملين", value: "ابناء عاملين"},
                            {label: "دمج", value: "دمج"},
                            {label: "يتيم", value: "يتيم"}
                        ],
                        placeholder: "لا يوجد"
                    }
                ]

            },
            {
                title: "بيانات الأب",
                fields: [
                    {
                        name: "father_name",
                        type: "text",
                        id: "name",
                        label: "الاسم",
                        placeholder: "الاسم"
                    },
                    {
                        name: 'father_phone_number',
                        type: 'text',
                        id: "father_phone_number",
                        label: "رقم الهاتف",
                        placeholder: "رقم الهاتف",
                        validator: validator.guardians.phoneNumber,
                        error: "رقم الهاتف غير صحيح",

                    },
                    {
                        name: "father_edu",
                        type: "text",
                        id: "father_education",
                        label: "المؤهل",
                        placeholder: "المؤهل"
                    },
                    {
                        name: "father_job",
                        type: "text",
                        id: "father_job",
                        label: "الوظيفة",
                        placeholder: "الوظيفة"
                    }
                ]
            },
            {
                title: "بيانات الأم",
                fields: [
                    {
                        name: "mother_name",
                        type: "text",
                        id: "name",
                        label: "الاسم",
                        placeholder: "الاسم"
                    },
                    {
                        name: 'mother_phone_number',
                        type: 'text',
                        id: "mother_phone_number",
                        label: "رقم الهاتف",
                        placeholder: "رقم الهاتف",
                        validator: validator.guardians.phoneNumber,
                        error: "رقم الهاتف غير صحيح",

                    },
                    {
                        name: "mother_edu",
                        type: "text",
                        id: "mother_edu",
                        label: "المؤهل",
                        placeholder: "المؤهل"
                    },
                    {
                        name: "mother_job",
                        type: "text",
                        id: "mother_job",
                        label: "الوظيفة",
                        placeholder: "الوظيفة"
                    }
                ]
            }
        ]
    const gradeOptionsByLevel = {
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
    }


    const filterFields = [
        {
            name: "classroom.level",
            type: "select",
            options: ["رياض اطفال", "ابتدائي", "اعدادي"],
            label: "المرحلة"
        },
        {
            name: "classroom.grade",
            type: 'select',
            multiple: true,
            options: (level) => {
                const options = Array.isArray(level) ? level.map(level => gradeOptionsByLevel[level].map(grade => `${grade.label} ${level}`)) : gradeOptionsByLevel[level] || []
                return options.flat();
            },
            dependency: "classroom.level",
            label: 'الصف',
            placeholder: 'اختر الصف'
        },
        {
            name: "classroom",
            type: "select",
            multiple: true,
            placeholder: "اختر الفصل",
            label: "الفصل",
            disabled: (values) => {
                let disabled = false;
                values.forEach(value => {
                    if (value === undefined || value === null) {
                        disabled = true;
                    }
                });
                return disabled;
            },
            options: (values) => {
                let [grade, level] = values;
                console.log(grade);
                return classrooms?.data?.filter(classroom => classroom.grade === grade?.[0] && classroom.level === level).map(classroom => classroom.name)

            },

            dependency: ["classroom.grade", "classroom.level"]
        }

    ]

    return (
        <Page>
            <Filters
                resource={"students"}
                onSubmit={(filter) => setTableFilters(filter)}

                fields={filterFields}
            />
            <Table
                resource={"students"}
                filters={tableFilters}
                fields={fields}
                editFields={editFields}
            />
        </Page>
    );
}
