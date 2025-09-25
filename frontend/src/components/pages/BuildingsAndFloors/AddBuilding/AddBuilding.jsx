import Page from "@ui/Page/Page.jsx";
import Form from "@ui/Form/Form.jsx";
import {useCreate} from "@hooks/api/useCrud.js";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import {useState} from "react";

export default function AddBuilding() {
    const {showSnackbar} = useSnackbar();
    const [serverErrors, setServerErrors] = useState();
    const mutation = useCreate("buildings",);

    const onFormSubmit = (data) => {
        setServerErrors(null);
        mutation.mutate(data, {
            onSuccess: () => {
                showSnackbar('تم اضافة المبني بنجاح')
            },
            onError: (error) => {
                setServerErrors(error?.response?.data?.errors);
                showSnackbar('حدث خطأ اثناء اضافة المبني', 'error')
            }
        });
    }
    const fields = [
        {
            name: "name",
            type: "text",
            label: "اسم المبني",
            required: true,
            placeholder: "اسم المبني"
        }
    ]
    return (
        <>
            <Page>
                <Form
                    fields={fields}
                    onFormSubmit={onFormSubmit}
                    serverErrors={serverErrors}
                />
            </Page>
        </>
    );
}
