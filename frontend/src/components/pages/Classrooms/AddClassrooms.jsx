import Page from "@ui/Page/Page.jsx";
import Form from "@ui/Form/Form.jsx";
import {useCreate} from "@hooks/api/useCrud.js";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import {useState} from "react";
import {ClassroomHelper} from "@utils/classroomHelper.js";



export default function AddClassrooms() {
    const creationMutation = useCreate("classrooms");
    const {showSnackbar} = useSnackbar();
    const [serverErrors, setServerErrors] = useState(null);



    const onFormSubmit = (data, formActions) => {
        setServerErrors(null);
        creationMutation.mutate(data, {
            onSuccess: () => {
                showSnackbar("تم إضافة الفصل بنجاح");
                formActions.resetForm();
                setServerErrors(null);
            },
            onError: (error) => {
                showSnackbar("حدث خطأ أثناء إضافة الفصل", "error");
                if (error?.response?.data?.errors) {
                    setServerErrors(error.response.data.errors);
                }
            }
        });
    };

    return (
        <Page>
            <Form
                fields={ClassroomHelper.getAllFields().filter(field=>field.name!=='classroom')}
                onFormSubmit={onFormSubmit}
                serverErrors={serverErrors}
            />
        </Page>
    );
}
