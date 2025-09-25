import Page from "@ui/Page/Page.jsx";
import Form from "@ui/Form/Form.jsx";
import {useState} from "react";
import {useSnackbar} from "@contexts/SnackbarContext.jsx"
import {useCreate, useGetAll} from "@hooks/api/useCrud.js";

export default function AddFloors() {
    const [serverErrors, setServerErrors] = useState();
    const {showSnackbar} = useSnackbar();
    const mutation = useCreate("floors")

    const onFormSubmit = (data) => {
        setServerErrors(null);
        mutation.mutate(data, {
            onSuccess: () => {
                showSnackbar("تم اضافة الدور بنجاح")
            },
            onError: (error) => {
                setServerErrors(error?.response?.data?.errors);
                showSnackbar("حدث خطأ اثناء اضافة الدور", "error")
            }
        })
    }
    const {data} = useGetAll('buildings');
    const fields = [
        {
            name: "name",
            type: "text",
            label: "اسم الدور",
            required: true,
            placeholder: "اسم الدور"

        },
        {
            name: "building_id",
            type: "select",
            label: "المبني",
            required: true,
            placeholder: "اختر مبني",
            options: data?.data.map(building => ({label: building.name, value: building.id}))
        }
    ];
    return (
        <>
            <Page>
                <Form
                    fields={fields}
                    serverErrors={serverErrors}
                    onFormSubmit={onFormSubmit}
                />
            </Page>
        </>
    );
}

