import Page from "@ui/Page/Page.jsx";
import Form from "@ui/Form/Form.jsx";
import {useState} from "react";
import {useCreate} from "@hooks/api/useCrud.js";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";


import {ClassroomHelper} from "@utils/helpers/ClassroomHelper.js";
import {SubjectHelper} from "@utils/helpers/SubjectHelper.js";

export default function AddSubjects() {
    const [serverErrors, setServerErrors] = useState();
    const mutation = useCreate('subjects');
    const {showSnackbar} = useSnackbar();

    const fields = [
        ClassroomHelper.FIELDS.ACADEMIC_YEAR,
        SubjectHelper.FIELDS.SEMESTER,
        ClassroomHelper.FIELDS.LANGUAGE,
        ClassroomHelper.FIELDS.LEVEL,
        ClassroomHelper.FIELDS.GRADE,
        {
            name: "type",
            type: "text",
            label: "نوع المادة",
            placeholder: "نوع المادة",
            required: true
        },
        SubjectHelper.FIELDS.NAME,
        SubjectHelper.FIELDS.MAX_MARKS,
        SubjectHelper.FIELDS.MIN_MARKS,
        SubjectHelper.FIELDS.ADDED_TO_REPORT,
        SubjectHelper.FIELDS.ADDED_TO_TOTAL
    ]
    const handleSubmit = (data) => {

        mutation.mutate(data, {
            onSuccess: () => {
                showSnackbar("تم إضافة المادة بنجاح");
            },
            onError: (error) => {
                setServerErrors(error?.response?.data?.errors);
                showSnackbar("حدث خطأ اثناء اضافة المادة", "error")
            }
        })
    }

    return (
        <>
            <Page>
                <Form
                    resource={"subjects"}
                    onFormSubmit={handleSubmit}
                    serverErrors={serverErrors}
                    fields={fields}
                />
            </Page>
        </>
    );
}

