import Page from "@ui/Page/Page.jsx";
import Form from "@ui/Form/Form.jsx";
import {ClassroomHelper} from "@helpers/ClassroomHelper.js";
import {useCreate, useGetAll} from "@hooks/api/useCrud.js";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import {useState} from "react";

export default function AddExpenses() {
    const {data: types} = useGetAll('expense-types');
    const mutation = useCreate('expenses')
    const {showSnackbar} = useSnackbar();
    const [serverErrors, setServerErrors] = useState();
    const onFormSubmit = (data) => {
        mutation.mutate(data, {
            onSuccess: () => {
                setServerErrors(null);
                showSnackbar("تم اضافة المصروفات بنجاح")
            },
            onError: (error) => {
                setServerErrors(error?.response?.data?.errors)
                showSnackbar('حدث خطأ في اضافة المصروفات', "error")
            }
        })
    }
    return (
        <>
            <Page>
                <Form
                    onFormSubmit={onFormSubmit}
                    fields={
                        [
                            ClassroomHelper.FIELDS.ACADEMIC_YEAR,
                            {
                                name: "type",
                                type: "select",
                                label: "نوع المصروف",
                                placeholder: "نوع المصروف",
                                options: types?.data?.map(type => type.name),
                                required: true
                            },
                            {
                                name: "value",
                                type: "number",
                                placeholder: 'القيمة',
                                label: 'القيمة',
                                required: true
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
                                type: "text",
                                placeholder: "البيان",
                                label: "البيان",
                                required: true,
                            }
                        ]
                    }
                />
            </Page>
        </>
    );
}

