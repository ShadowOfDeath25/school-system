import Page from "@ui/Page/Page.jsx";
import Form from "@ui/Form/Form.jsx";
import { ClassroomHelper } from "@helpers/ClassroomHelper.js";
import { useState } from "react";
import { useCreate, useGetAll } from "@hooks/api/useCrud.js";
import { useSnackbar } from "@contexts/SnackbarContext.jsx";

export default function AddBankAccounts() {
    const [serverErrors, setServerErrors] = useState();
    const mutation = useCreate('bank-accounts');
    const { showSnackbar } = useSnackbar()
    const { data: academicYears = [] } = useGetAll('academic-years')
    const onSubmit = (data, actions) => {
        mutation.mutate(data, {
            onSuccess: () => {
                setServerErrors(null);
                showSnackbar("تم اضافة حركة بنجاح")
                actions.resetForm();
            }, onError: (error) => {
                setServerErrors(error?.response?.data?.errors);
                showSnackbar(error?.response?.data?.message, "error")
            }
        })
    }
    return (<>
        <Page>
            <Form
                onFormSubmit={onSubmit}
                serverErrors={serverErrors}
                fields={[{ ...ClassroomHelper.FIELDS.ACADEMIC_YEAR, options: academicYears }, {
                    name: "type", label: "نوع العملية", type: "radio", options: ['سحب', "ايداع"], required: true,
                }, {
                    name: "value", type: "number", label: "القيمة", required: true, placeholder: "القيمة"
                }, {
                    name: "manager_name",
                    type: "text",
                    label: "اسم المسؤول",
                    placeholder: "اسم المسئول",
                    required: true
                }, {
                    name: "date",
                    type: "date",
                    placeholder: 'بتاريخ',
                    label: 'بتاريخ',
                    required: true,
                    value: new Date(Date.now()).toISOString().slice(0, 10)
                }, {
                    name: "notes", label: "ملاحظات", placeholder: "ملاحظات", required: false, type: "text"
                }]}
            />

        </Page>
    </>);
}

