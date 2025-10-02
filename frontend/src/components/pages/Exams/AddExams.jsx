import Page from "@ui/Page/Page.jsx";
import Form from "@ui/Form/Form.jsx";
import {getAcademicYears} from "@utils/getAcademicYears.js";
import {CLASSROOMS} from "@constants/classrooms.js";
import {SUBJECTS} from "@constants/subjects.js";
import {getGradeOptionsByLevel} from "@utils/getGradeOptionsByLevel.js";
import {useCreate, useGetAll} from "@hooks/api/useCrud.js";
import {value} from "loadsh/seq.js";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import {useState} from "react";
import {EXAMS} from "@constants/exams.js";

export default function AddExams() {
    const {data: subjects} = useGetAll('subjects', {all: true})
    const mutation = useCreate('exams');
    const {showSnackbar} = useSnackbar();
    console.log(subjects?.data)
    const [serverErrors, setServerErrors] = useState(null);
    const fields = [
        {
            name: "name",
            label: "اسم الاختبار",
            type: "text",
            placeholder: "اسم الاختبار",
            required: true,
        },
        {
            name: "academic_year",
            label: "العام الدراسي",
            type: "select",
            options: getAcademicYears(),
            required: true,
            placeholder: "اختر العام الدراسي"
        }, {
            name: "semester",
            label: "الفصل الدراسي",
            type: "select",
            required: true,
            placeholder: "اختر الفصل الدراسي",
            options: SUBJECTS.SEMESTERS
        }, {
            name: 'language',
            label: 'اللغة',
            type: 'select',
            required: true,
            placeholder: "اختر اللغة",
            options: CLASSROOMS.LANGUAGES
        },

        {
            name: "level",
            label: "المرحلة",
            type: "select",
            required: true,
            placeholder: "اختر مرحلة",
            options: CLASSROOMS.LEVELS
        }, {
            name: "grade",
            label: 'الصف',
            type: "select",
            placeholder: "اختر الصف",
            options: getGradeOptionsByLevel,
            dependency: 'level',
            disabled: (value) => !value,
            required: true
        }, {
            name: "subject.type",
            label: "نوع المادة",
            type: "select",
            placeholder: "اختر نوع المادة",
            required: true,
            options: subjects?.data ? [...new Set(subjects.data.map(subject => subject.type))] : []
        },
        {
            name: "subject_id",
            label: "اسم المادة",
            type: "select",
            placeholder: "اختر المادة",
            required: true,
            dependency: ['subject.type', 'academic_year', 'grade', 'level', 'language'],
            options: (values) =>
                subjects?.data ? subjects?.data
                    .filter(
                        subject => subject.type === values[0]
                            && subject.academic_year === values[1]
                            && subject.grade === values[2]
                            && subject.level === values[3]
                            && subject.language === values[4]
                    ).map(subject => ({label: subject.name, value: subject.id})) : [],
            disabled: (values) => values.some(value => !value)
        },
        {
            name: "type",
            label: "نوع الاختبار",
            type: "select",
            required: true,
            options: EXAMS.TYPES
        },
        {
            name: "date",
            label: "موعد الاختبار",
            type: "datetime-local",
            required: true,
        },
        {
            name: "duration_in_hours",
            label: "المدة بالساعات",
            type: "number",
            required: true,
        },
        {
            name: "min_marks",
            label: "الدرجة الصغري",
            type: "number",
            placeholder: 'الدرجة الصغري',
            required: true,
        },
        {
            name: "max_marks",
            label: "الدرجة العظمي",
            type: "number",
            placeholder: 'الدرجة العظمي',
            required: true,
        },
    ]

    const onSubmit = (data) => {
        setServerErrors(null);
        mutation.mutate(data, {
            onSuccess: () => {
                showSnackbar('تمت اضافة الاختبار بنجاح')
            },
            onError: (error) => {
                showSnackbar('حدث خطأ أثناء إضافة الاختبار', 'error')
                setServerErrors(error?.response?.data?.errors)
            }
        })
    }

    return (<>
        <Page>
            <Form
                resource={'exams'}
                fields={fields}
                onFormSubmit={onSubmit}
                serverErrors={serverErrors}
            />
        </Page>
    </>);
}
