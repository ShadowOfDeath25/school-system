import Page from "@ui/Page/Page.jsx";
import Form from "@ui/Form/Form.jsx";
import { ClassroomHelper } from "@utils/helpers/ClassroomHelper.js";
import { SubjectHelper } from "@utils/helpers/SubjectHelper.js";
import { useCreate, useGetAll } from "@hooks/api/useCrud.js";
import { useSnackbar } from "@contexts/SnackbarContext.jsx";
import { useState } from "react";
import { ExamHelper } from "@helpers/ExamHelper.js";

export default function AddExams() {
    const { data: subjects } = useGetAll('subjects', { all: true })
    const { data: academicYears = [] } = useGetAll('academic-years', {}, {
        select: (data) => data?.data?.map((academicYear) => academicYear.name)
    })
    const mutation = useCreate('exams');
    const { showSnackbar } = useSnackbar();
    const [serverErrors, setServerErrors] = useState(null);
    const fields = [
        ExamHelper.FIELDS.NAME,
        { ...ClassroomHelper.FIELDS.ACADEMIC_YEAR, options: academicYears },
        {
            name: "semester",
            label: "الفصل الدراسي",
            type: "select",
            required: true,
            placeholder: "اختر الفصل الدراسي",
            options: SubjectHelper.SEMESTERS
        },
        ClassroomHelper.FIELDS.LANGUAGE,
        ClassroomHelper.FIELDS.LEVEL,
        ClassroomHelper.FIELDS.GRADE,
        {
            ...SubjectHelper.FIELDS.TYPE,
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
                            && subject.ACADEMIC_YEAR === values[1]
                            && subject.GRADE === values[2]
                            && subject.LEVEL === values[3]
                            && subject.LANGUAGE === values[4]
                    ).map(subject => ({ label: subject.name, value: subject.id })) : [],
            disabled: (values) => values.some(value => !value)
        },
        ExamHelper.FIELDS.TYPE,
        ExamHelper.FIELDS.DATE,
        ExamHelper.FIELDS.DURATION_IN_HOURS,
        ExamHelper.FIELDS.MIN_MARKS,
        ExamHelper.FIELDS.MAX_MARKS,
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
