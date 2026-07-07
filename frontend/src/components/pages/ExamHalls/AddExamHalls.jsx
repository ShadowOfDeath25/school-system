import Page from "@ui/Page/Page.jsx";
import Form from "@ui/Form/Form.jsx";
import { useCreate, useGetAll } from "@hooks/api/useCrud.js";
import { useSnackbar } from "@contexts/SnackbarContext.jsx";
import { useState } from "react";
import { ClassroomHelper } from "@utils/helpers/ClassroomHelper.js";

export default function AddExamHalls() {
    const mutation = useCreate("exam-halls");
    const { showSnackbar } = useSnackbar();
    const [serverErrors, setServerErrors] = useState(null);

    const { data: academicYears = [] } = useGetAll("academic-years", {}, {
        select: (data) => data?.data?.map((academicYear) => academicYear.name),
    });

    const { data: classrooms } = useGetAll("classrooms", { all: true });

    const onFormSubmit = (data, formActions) => {
        setServerErrors(null);
        mutation.mutate(data, {
            onSuccess: () => {
                showSnackbar("تم إضافة اللجنة بنجاح");
                formActions.resetForm();
            },
            onError: (error) => {
                showSnackbar("حدث خطأ أثناء إضافة اللجنة", "error");
                if (error?.response?.data?.errors) {
                    setServerErrors(error.response.data.errors);
                }
            },
        });
    };

    const fields = [
        {
            ...ClassroomHelper.FIELDS.ACADEMIC_YEAR,
            options: academicYears,
        },
        {
            name: "classroom_id",
            type: "select",
            label: "الفصل",
            placeholder: "اختر الفصل",
            required: true,
            options: classrooms?.data?.map((classroom) => ({
                label: `${classroom.name} - ${classroom.language}`,
                value: classroom.id,
            })),
        },
        {
            name: "capacity",
            type: "number",
            label: "السعة",
            placeholder: "السعة",
            required: true,
        },
    ];

    return (
        <Page>
            <Form
                fields={fields}
                onFormSubmit={onFormSubmit}
                serverErrors={serverErrors}
            />
        </Page>
    );
}
