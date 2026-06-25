import Page from "@ui/Page/Page.jsx";
import Form from "@ui/Form/Form.jsx";
import { ClassroomHelper } from "@utils/helpers/ClassroomHelper.js";
import { useCreate, useGetAll } from "@hooks/api/useCrud.js";
import { useSnackbar } from "@contexts/SnackbarContext.jsx";
import { useState } from "react";
import { ExamHelper } from "@helpers/ExamHelper.js";

export default function AddExams() {
    const [formData, setFormData] = useState({});
    const { data: subjects } = useGetAll(`grades/${formData.grade}/subjects`, { language: formData.language }, {
        enabled: !!(formData.language && formData.grade)
    });
    const selectedSubject = subjects?.data?.find((subject) => Number(subject.id) === Number(formData.grade_subject_id));
    const { data: academicYears = [] } = useGetAll('academic-years', {}, {
        select: (data) => data?.data?.map((academicYear) => academicYear.name)
    });
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
            options: ["Ø§Ù„Ø§ÙˆÙ„", "Ø§Ù„Ø«Ø§Ù†ÙŠ"]
        },
        ClassroomHelper.FIELDS.LANGUAGE,
        ClassroomHelper.FIELDS.LEVEL,
        ClassroomHelper.FIELDS.GRADE,
        {
            name: "grade_subject_id",
            label: "اسم المادة",
            type: "select",
            placeholder: "اختر المادة",
            required: true,
            dependency: ['grade', 'language'],
            options: () =>
                subjects?.data ? subjects?.data
                    .map(subject => ({ label: subject.name, value: subject.id })) : [],
            disabled: (values) => values.some(value => !value)
        },
        {
            name: "component_id",
            label: "مكون الدرجات",
            type: "select",
            placeholder: "اختر المكون",
            required: true,
            dependency: 'grade_subject_id',
            options: () => selectedSubject?.components?.map((component) => ({
                label: `${component.name} - ${component.marks} درجة`,
                value: component.id,
            })) ?? [],
            disabled: (value) => !value
        },
        ExamHelper.FIELDS.TYPE,
        ExamHelper.FIELDS.DATE,
        ExamHelper.FIELDS.DURATION_IN_HOURS,
    ];

    const onSubmit = (data) => {
        setServerErrors(null);
        mutation.mutate(data, {
            onSuccess: () => {
                showSnackbar('تمت إضافة الاختبار بنجاح');
            },
            onError: (error) => {
                showSnackbar('حدث خطأ أثناء إضافة الاختبار', 'error');
                setServerErrors(error?.response?.data?.errors);
            }
        });
    };

    return (<>
        <Page>
            <Form
                resource={'exams'}
                fields={fields}
                onFormSubmit={onSubmit}
                serverErrors={serverErrors}
                values={formData}
                setValues={setFormData}
            />
        </Page>
    </>);
}