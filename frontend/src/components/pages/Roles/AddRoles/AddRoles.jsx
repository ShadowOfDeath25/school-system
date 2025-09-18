import Page from "@ui/Page/Page.jsx";
import {useCreate, useGetAll} from "@hooks/api/useCrud.js";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import Form from "@ui/Form/Form.jsx";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";


export default function AddRoles() {
    const {data: permissions, isLoading, isError, error} = useGetAll("permissions");
    const {i18n, t} = useTranslation();
    const [serverErrors, setServerErrors] = useState(null);
    const {showSnackbar} = useSnackbar()
    const creationMutation = useCreate("roles");

    const fields = [
        {
            name: "name",
            label: "اسم الرتبة",
            type: "text",
            required: true,
            placeholder: "اسم الرتبة",

        }
    ]
    fields.push(...Object.keys(permissions || {})?.map((key) => {
        return {
            name: key,
            label: t(key),
            type: "select",
            multiple: true,
            required: false,
            options: permissions[key]?.map((permission) => ({label: t(permission), value: `${permission} ${key}`})),
            placeholder: "لا صلاحية"
        }
    }));


    const handleSubmit = (data) => {

        const normalizedData = Object.values(data).filter((value) => value !== "" && value !== data.name).flat();
        creationMutation.mutate({name: data.name, permissions: normalizedData}, {
            onSuccess: () => {
                showSnackbar("تم اضافة الرتبة بنجاح")
            },
            onError: (mutationError) => {
                setServerErrors(mutationError.response.data.errors);
                showSnackbar("حدث خطأ اثناء اضافة الرتبة", "error")
                console.log(mutationError)
            }
        })
    }
    if (isLoading) {
        return <LoadingScreen/>
    }
    return (
        <>
            <Page>
                {isError &&
                    <h3 className={"serverError"}>حدث خطأ اثناء التحميل</h3>
                }
                {isError ||
                    <Form fields={fields} onFormSubmit={handleSubmit} serverErrors={serverErrors}/>
                }
            </Page>
        </>
    );
}

