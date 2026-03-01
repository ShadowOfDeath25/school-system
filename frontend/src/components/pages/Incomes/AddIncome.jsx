import Page from "@ui/Page/Page.jsx";
import { useCreate, useGetAll } from "@hooks/api/useCrud.js";
import { useSnackbar } from "@contexts/SnackbarContext.jsx";
import { useState } from "react";
import Form from "@ui/Form/Form.jsx";
import { ClassroomHelper } from "@helpers/ClassroomHelper.js";

export default function AddIncome() {
    const mutation = useCreate('incomes');
    const { showSnackbar } = useSnackbar()
    const [serverErrors, setServerErrors] = useState();
    const { data: types } = useGetAll("income-types")
    const { data: academicYears = [] } = useGetAll('academic-years', {}, {
        select: (data) => data?.data?.map((academicYear) => academicYear.name)
    })
    const onSubmit = (data, actions) => {
        mutation.mutate(data, {
            onSuccess: () => {
                showSnackbar("تم اضافة حركة الايرادات بنجاح")
                actions.resetForm();
            },
            onError: (error) => {
                showSnackbar(error?.response?.data?.message, "error")
                setServerErrors(error?.response?.data?.errors)
            }
        })
    }

    return (
        <>
            <Page>
                <Form
                    fields={[
                        { ...ClassroomHelper.FIELDS.ACADEMIC_YEAR, options: academicYears },

                        {
                            name: "type",
                            type: "select",
                            label: "النوع",
                            options: types?.data?.map(record => record.name),
                            required: true,
                            placeholder: "اختر النوع"
                        },
                        {
                            name: "value",
                            type: "number",
                            label: "القيمة",
                            required: true,
                            placeholder: "القيمة"
                        },
                        {
                            name: "date",
                            type: "date",
                            placeholder: 'بتاريخ',
                            label: 'بتاريخ',
                            required: true,
                            value: new Date(Date.now()).toISOString().slice(0, 10)
                        },
                        {
                            name: "description",
                            label: "البيان",
                            placeholder: "البيان",
                            type: "text",
                        }
                    ]}
                    serverErrors={serverErrors}
                    onFormSubmit={onSubmit}

                />


            </Page>
        </>
    );
}

