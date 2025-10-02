import Page from "@ui/Page/Page.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import {useState} from "react";
import Table from "@ui/Table/Table.jsx";
import {validator} from "@utils/validator.js";
import {useGetAll, useUpdate} from "@hooks/api/useCrud.js";
import {value} from "loadsh/seq.js";
import {getGradeOptionsByLevel} from "@utils/getGradeOptionsByLevel.js";
import {Button} from '@mui/material'
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import {useConfirmModal} from "@contexts/ConfirmModalContext.jsx";
import {CLASSROOMS} from "@constants/classrooms.js";

export default function ViewStudents() {
    const [tableFilters, setTableFilters] = useState(null);
    const {data: classrooms} = useGetAll("classrooms", {all: "true"});
    const mutation = useUpdate('students');
    const fields = [
        {name: "reg_number", label: "رقم القيد"},
        {
            name: 'name_in_arabic',
            label: 'الاسم'
        },
        {name: 'nid'}, {name: 'status'}, {name: "classroom"}
    ]
    const {showSnackbar} = useSnackbar();
    const {confirm} = useConfirmModal();
    const editFields = [
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


    const filterFields = [
        {
            name: "classroom.level",
            type: "select",
            options: CLASSROOMS.LEVELS,
            label: "المرحلة",
            placeholder: "اختر المرحلة"
        },
        {
            name: "classroom.grade",
            type: 'select',
            dependency: "classroom.level",
            options: getGradeOptionsByLevel,
            disabled: (values) => !values,
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
                return [...new Set(classrooms?.data?.filter(classroom => classroom.grade === grade && classroom.level === level).map(classroom => classroom.name))]
            },

            dependency: ["classroom.grade", "classroom.level"]
        }

    ]
    const handleWithdraw = async (student) => {
        const confirmed = await confirm({message: "هل أنت متأكد من سحب ملف هذا الطالب ؟"})
        if (confirmed) {

            mutation.mutate({id: student.id, withdrawn: true}, {
                onSuccess: () => {
                    showSnackbar("تم سحب ملف الطالب بنجاح")
                },
                onError: (error) => {
                    showSnackbar("حدث خطأ أثناء سحب الملف", "error")
                }
            })
        }
    }
    const enrollButton = {
        header: "سحب الملف", content: (student) => <Button
            onClick={() => handleWithdraw(student)}
            variant={"contained"}
            sx={{backgroundColor:"var(--color-danger)"}}

        >
            سحب الملف
        </Button>
    }
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
            >
                {enrollButton}
            </Table>
        </Page>
    );
}
