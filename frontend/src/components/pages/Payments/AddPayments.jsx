import Page from "@ui/Page/Page.jsx";
import Form from "@ui/Form/Form.jsx";
import {useState} from "react";
import {useCreate} from "@hooks/api/useCrud.js";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import {ClassroomHelper} from "@helpers/ClassroomHelper.js";

export default function AddPayments() {
    const [serverErrors, setServerErrors] = useState();
    const mutation = useCreate('payment-values')
    const {showSnackbar} = useSnackbar()
    const onSubmit = (data, formActions) => {

        mutation.mutate(data, {
            onSuccess: () => {
                showSnackbar("تم اضافة العنصر بنجاح")
                formActions.resetForm()
            },
            onError: (error) => {
                setServerErrors(error?.response?.data?.errors)
                showSnackbar(error?.response?.data?.message,"error")
            }
        })
    }

    return (
        <>
            <Page>
                <Form
                    fields={
                        [
                            ClassroomHelper.FIELDS.ACADEMIC_YEAR,
                            ClassroomHelper.FIELDS.LEVEL,
                            ClassroomHelper.FIELDS.LANGUAGE,
                            {
                                name: "type",
                                label: "النوع",
                                type: "select",
                                options: ['مصروفات ادارية', 'مصروفات مدرسية', 'مصروفات السيارة'],
                                placeholder: 'اختر النوع',
                                required: true,
                            },
                            {
                                name: "value",
                                label: "القيمة",
                                type: "number",
                                min: 0,
                                placeholder: "القيمة",
                                required: true,
                            }
                        ]
                    }
                    serverErrors={serverErrors}
                    onFormSubmit={onSubmit}
                />
            </Page>
        </>
    );
}

