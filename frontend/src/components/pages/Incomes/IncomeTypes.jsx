import Form from "@ui/Form/Form.jsx";
import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import {useCreate} from "@hooks/api/useCrud.js";
import {useState} from "react";

export default function IncomeTypes() {
    const {showSnackbar} = useSnackbar();
    const mutation = useCreate("income-types")
    const [serverErrors, setServerErrors] = useState();
    const onSubmit = (data, actions) => {
        mutation.mutate(data, {
            onSuccess: () => {
                actions.resetForm();
                showSnackbar("تم اضافة النوع بنجاح")
            },
            onError: (error) => {
                showSnackbar(error?.response?.data?.message, "error")
                setServerErrors(error?.response?.data?.errors);
            }
        })
    }
    return (
        <>
            <Page>
                <Form
                    fields={[{
                        name: "name", type: "text", required: true, label: "النوع"
                    }]}
                    btnText={"إضافة"}
                    onFormSubmit={onSubmit}
                    serverErrors={serverErrors}
                />
                <Table
                    resource={'income-types'}
                    fields={[{label: "النوع", name: "name"}]}
                    editable={false}
                />
            </Page>
        </>
    );
}

