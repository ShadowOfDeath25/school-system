import {useState} from "react";
import {useCreate} from "@hooks/api/useCrud.js";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import Page from "@ui/Page/Page.jsx";
import Form from "@ui/Form/Form.jsx";
import {ClassroomHelper} from "@helpers/ClassroomHelper.js";
import {UniformHelper} from "@helpers/UniformHelper.js";

export default function AddUniforms() {
    const [serverErrors, setServerErrors] = useState();
    const mutation = useCreate('uniforms')
    const {showSnackbar} = useSnackbar()

    const handleSubmit = (data) => {
        data.available_quantity = data.imported_quantity

        mutation.mutate(data, {
            onSuccess: () => {
                setServerErrors(null);
                showSnackbar('تم اضافة الزي بنجاح')
            },
            onError: (error) => {
                showSnackbar('حدث خطأ اثناء اضافة الزي', "error")
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
                        UniformHelper.FIELDS.TYPE,
                        UniformHelper.FIELDS.SELL_PRICE,
                        UniformHelper.FIELDS.BUY_PRICE,
                        UniformHelper.FIELDS.IMPORTED_QUANTITY,
                        UniformHelper.FIELDS.SIZE,
                        UniformHelper.FIELDS.PIECE,
                        ClassroomHelper.FIELDS.GRADE
                    ]}
                    onFormSubmit={handleSubmit}
                />
            </Page>
        </>
    );
}

