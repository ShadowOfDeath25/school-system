import Page from "@ui/Page/Page.jsx";
import Form from "@ui/Form/Form.jsx";
import { ClassroomHelper } from "@helpers/ClassroomHelper.js";
import { SeatNumberHelper } from "@helpers/SeatNumberHelper.js";
import { SubjectHelper } from "@helpers/SubjectHelper.js";
import { useSnackbar } from '@contexts/SnackbarContext.jsx'
import { useState } from "react";
import { useCreate, useGetAll } from "@hooks/api/useCrud.js";

export default function AddSecretNumber() {
    const mutation = useCreate('secret-numbers');
    const { showSnackbar } = useSnackbar();
    const [serverErrors, setServerErrors] = useState();
    const { data: academicYears = [] } = useGetAll('academic-years')
    const onSubmit = (data) => {
        mutation.mutate(data, {
            onSuccess: () => {
                setServerErrors(null);
                showSnackbar('تم اضافة الرقم السري بنجاح')
            },
            onError: (error) => {
                setServerErrors(error?.response?.data?.errors);
                showSnackbar('حدث خطأ اثناء اضافة الرقم السري', 'error')
            }
        })
    };
    return (
        <>
            <Page>
                <Form
                    fields={[
                        { ...ClassroomHelper.FIELDS.ACADEMIC_YEAR, options: academicYears },
                        {
                            name: "group_number",
                            required: true,
                            label: "رقم المجموعة",
                            placeholder: "رقم المجموعة",

                        },
                        {
                            ...ClassroomHelper.FIELDS.MAX_CAPACITY,
                            name: "group_capacity",
                            label: 'طاقة المجموعة',
                            placeholder: "طاقة المجموعة"

                        },
                        SeatNumberHelper.FIELDS.STARTS_AT,
                        SeatNumberHelper.FIELDS.ENDS_AT,
                        ClassroomHelper.FIELDS.LEVEL,
                        ClassroomHelper.FIELDS.GRADE,
                        SubjectHelper.FIELDS.SEMESTER,
                        ClassroomHelper.FIELDS.LANGUAGE
                    ]}
                    onFormSubmit={onSubmit}
                    serverErrors={serverErrors}

                />
            </Page>
        </>
    );
}

