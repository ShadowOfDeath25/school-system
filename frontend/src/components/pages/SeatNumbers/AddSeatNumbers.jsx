import Page from "@ui/Page/Page.jsx";
import Form from "@ui/Form/Form.jsx";
import { ClassroomHelper } from "@helpers/ClassroomHelper.js";
import { SeatNumberHelper } from "@helpers/SeatNumberHelper.js";
import { useState } from "react";
import { useCreate } from "@hooks/api/useCrud.js";
import { useSnackbar } from "@contexts/SnackbarContext.jsx";
import { useGetAll } from "@hooks/api/useCrud.js";

export default function AddSeatNumbers() {
    const [serverErrors, setServerErrors] = useState();
    const mutation = useCreate('seat-numbers');
    const { data: academicYears = [] } = useGetAll('academic-years');
    const { showSnackbar } = useSnackbar();
    const fields = [
        { ...ClassroomHelper.FIELDS.ACADEMIC_YEAR, options: academicYears },
        ClassroomHelper.FIELDS.LEVEL,
        ClassroomHelper.FIELDS.GRADE,
        ClassroomHelper.FIELDS.LANGUAGE,
        SeatNumberHelper.FIELDS.STARTS_AT,
        SeatNumberHelper.FIELDS.ENDS_AT
    ]

    const onSumbit = (data) => {
        mutation.mutate(data, {
            onSuccess: () => {
                showSnackbar('تم اضافة أرقام الجلوس بنجاح')
            },
            onError: (error) => {
                setServerErrors(error?.response?.data?.errors)
                showSnackbar('حدث خطأ اثناء اضافة ارقام الجلوس', 'error')
            }
        })
    }

    return (
        <>
            <Page>
                <Form
                    resource={'seat-numbers'}
                    fields={fields}
                    serverErrors={serverErrors}
                    onFormSubmit={onSumbit}
                />
            </Page>
        </>
    );
}

