import Page from "@ui/Page/Page.jsx";
import Form from "@ui/Form/Form.jsx";
import {useState} from "react";
import {useCreate} from "@hooks/api/useCrud.js";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import {getAcademicYears} from "@utils/getAcademicYears.js";

import {ClassroomHelper} from "@utils/ClassroomHelper.js";
import {SubjectHelper} from "@utils/SubjectHelper.js";

export default function AddSubjects() {
    const [serverErrors, setServerErrors] = useState();
    const mutation = useCreate('subjects');
    const {showSnackbar} = useSnackbar();

    const fields = [
        {
            name: "academic_year",
            type: "select",
            label: "العام الدراسي",
            options: getAcademicYears(),
            required: true,
            placeholder: "اختر العام الدراسي"
        },
        {
            name: "semester",
            type: "select",
            label: "الفصل الدراسي",
            options: SubjectHelper.SEMESTERS,
            required: true,
            placeholder: "اختر الفصل الدراسي"
        },
        {
            name: "language",
            type: 'select',
            label: "اللغة",
            options: ClassroomHelper.LANGUAGES,
            required: true,
            placeholder: "اختر اللغة"
        },
        {
            name: "level",
            type: "select",
            label: "المرحلة",
            options: ClassroomHelper.LEVELS,
            required: true,
            placeholder: "اختر مرحلة"
        },
        {
            name: "grade",
            type: "select",
            label: "الفرقة",
            placeholder: "اختر الفرقة",
            dependency: 'level',
            options: ClassroomHelper.getGradeOptionsByLevel,
            disabled: (value) => !value,
            required: true
        },
        {
            name: "type",
            type: "text",
            label: "نوع المادة",
            placeholder: "نوع المادة",
            required: true
        },
        {
            name: "name",
            type: "text",
            label: "اسم المادة",
            placeholder: "اسم المادة",
            required: true
        },
        {
            name: "max_marks",
            type: "number",
            label: "الدرجة العظمي",
            placeholder: "الدرجة العظمي",
            required: true
        },
        {
            name: "min_marks",
            type: "number",
            label: "الدرجة الصغري",
            placeholder: "الدرجة الصغري",
            required: true
        },
        {
            name: "added_to_report",
            type: "radio",
            required: true,
            options: [{label: "نعم", value: 1}, {label: "لا", value: 0}],
            label: "تضاف للكشف"
        },
        {
            name: "added_to_total",
            type: "radio",
            required: true,
            options: [{label: "نعم", value: 1}, {label: "لا", value: 0}],
            label: "تضاف للمجموع"
        },
    ]
    const handleSubmit = (data) => {

        mutation.mutate(data, {
            onSuccess: () => {
                showSnackbar("تم إضافة المادة بنجاح");
            },
            onError: (error) => {
                setServerErrors(error?.response?.data?.errors);
                showSnackbar("حدث خطأ اثناء اضافة المادة", "error")
            }
        })
    }

    return (
        <>
            <Page>
                <Form
                    resource={"subjects"}
                    onFormSubmit={handleSubmit}
                    serverErrors={serverErrors}
                    fields={fields}
                />
            </Page>
        </>
    );
}

