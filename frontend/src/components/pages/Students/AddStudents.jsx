import Page from "@ui/Page/Page.jsx";
import Form from "@ui/Form/Form.jsx";
import {useCreate} from "@hooks/api/useCrud.js";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import {useState} from "react";
import {StudentHelper} from "@utils/StudentHelper.js";

export default function AddStudents() {
    const creationMutation = useCreate("students");
    const {showSnackbar} = useSnackbar();
    const [serverErrors, setServerErrors] = useState();

    const normalizeData = (data) => {
        const normalizedData = {}
        const fatherData = {}
        const motherData = {}
        for (const key in data) {
            if (key.includes('father')) {
                fatherData[key.replace('father_', '')] = data[key];
            } else if (key.includes('mother')) {
                motherData[key.replace("mother_", "")] = data[key];
            } else {
                normalizedData[key] = data[key];
            }
        }
        fatherData.gender = "male";
        motherData.gender = "female";
        normalizedData.guardians = [fatherData, motherData]
        return normalizedData;
    }

    const onFormSubmit = (data, formActions) => {
        setServerErrors(undefined);
        creationMutation.mutate(normalizeData(data), {
            onSuccess: () => {
                showSnackbar("تم إضافة الطالب بنجاح");
                setServerErrors(undefined);
                formActions.resetForm();
            },
            onError: (error) => {
                showSnackbar("حدث خطأ أثناء إضافة الطالب", "error");
                setServerErrors(error?.response?.data?.errors);
            }
        });
    };

    return (
        <Page>
            <Form
                fields={StudentHelper.getAllFields()}
                serverErrors={serverErrors}
                onFormSubmit={onFormSubmit}
            />
        </Page>
    );
}
