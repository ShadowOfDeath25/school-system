import Page from "@ui/Page/Page.jsx";
import Form from "@ui/Form/Form.jsx";
import {useState} from "react";
import {ClassroomHelper} from "@helpers/ClassroomHelper.js";
import {SubjectHelper} from "@helpers/SubjectHelper.js";
import {useCreate} from "@hooks/api/useCrud.js";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";

export default function AddBooks() {
    const [serverErrors, setServerErrors] = useState();
    const mutation = useCreate('books')
    const {showSnackbar} = useSnackbar()

    const handleSubmit = (data) => {
        data.available_quantity = data.imported_quantity

        mutation.mutate(data, {
            onSuccess: () => {
                setServerErrors(null);
                showSnackbar('تم اضافة الكتب بنجاح')
            },
            onError: (error) => {
                showSnackbar('حدث خطأ اثناء اضافة الكتب', "error")
                setServerErrors(error.response.data.errors);
            }
        })

    }

    return (
        <>
            <Page>
                <Form
                    serverErrors={serverErrors}
                    fields={[
                        ClassroomHelper.FIELDS.ACADEMIC_YEAR,
                        SubjectHelper.FIELDS.SEMESTER,
                        ClassroomHelper.FIELDS.LANGUAGE,
                        ClassroomHelper.FIELDS.LEVEL,
                        ClassroomHelper.FIELDS.GRADE,
                        {
                            name: "type",
                            label: "النسخة",
                            type: "text",
                            required: true,
                            placeholder: "النسخة"
                        },
                        {
                            name: "price",
                            label: "السعر",
                            type: "number",
                            required: true,
                            placeholder: "السعر"
                        },
                        {
                            name: "imported_quantity",
                            label: "الكمية الواردة",
                            type: "number",
                            required: true,
                            placeholder: "السعر"
                        },

                    ]}
                    onFormSubmit={handleSubmit}
                />
            </Page>
        </>
    );
}

