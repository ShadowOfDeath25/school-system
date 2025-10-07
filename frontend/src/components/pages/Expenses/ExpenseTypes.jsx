import Page from "@ui/Page/Page.jsx";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import {useCreate} from "@hooks/api/useCrud.js";
import {useState} from "react";
import Form from "@ui/Form/Form.jsx";
import Table from "@ui/Table/Table.jsx";

export default function ExpenseTypes() {
    const {showSnackbar} = useSnackbar();
    const mutation = useCreate('expense-types')
    const [serverErrors, setServerErrors] = useState();
    const onSubmit = (data, options) => {
        mutation.mutate(data, {
            onSuccess: () => {
                setServerErrors(null)
                showSnackbar("تمت اضافة النوع بنجاح")
                options.resetForm();
            },
            onError: () => {
                setServerErrors({name: "هذا النوع موجود بالفعل"})
                showSnackbar('حدث خطأ اثناء اضافة النوع', "error")
            }
        })
    }


    return (

        <Page>
            <Form
                fields={[{
                    name: "name",
                    label: "النوع",
                    type: "text",
                    required: true,
                    placeholder: 'النوع',
                    error: "هذا النوع موجود بالفعل"
                }]}
                title={"اضافة نوع"}
                onFormSubmit={onSubmit}
            />
            <Table
                resource={"expense-types"}
                editable={false}
                fields={[{name:"name",label:"النوع"}]}
            />
        </Page>

    );
}

