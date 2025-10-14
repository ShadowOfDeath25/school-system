import {useState} from "react";
import {useCreate, useGetAll} from "@hooks/api/useCrud.js";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import Page from "@ui/Page/Page.jsx";
import Form from "@ui/Form/Form.jsx";
import {ClassroomHelper} from "@helpers/ClassroomHelper.js";
import {StudentHelper} from "@helpers/StudentHelper.js";

const initialFormValues = {
    academic_year: ""
};

export default function BuyUniforms() {
    const [formValues, setFormValues] = useState(initialFormValues);
    const {academic_year, level, grade, semester} = formValues;
    const mutation = useCreate('uniform-purchases')
    const canFetchTypes = !!academic_year;
    const {showSnackbar} = useSnackbar();
    const {data: uniforms, isLoading: isLoadingTypes} = useGetAll('uniforms', {
        types: true, academic_year, level, grade, semester
    }, {
        enabled: canFetchTypes, placeholderData: []
    });

    const onSubmit = (data) => {
        mutation.mutate({
            uniform_id: data.type, student_name: data.student_name, quantity: data.quantity
        }, {
            onSuccess: () => {
                showSnackbar("تم صرف الزي بنجاح")
                setFormValues(initialFormValues);
            }, onError: (error) => {
                showSnackbar(error.response.data.message, "error")
            }
        });

    }
    return (<>
        <Page>
            <Form
                values={formValues}
                setValues={setFormValues}
                fields={[ClassroomHelper.FIELDS.ACADEMIC_YEAR, {
                    name: 'type',
                    label: 'نوع الزي',
                    id: 'type',
                    type: 'select',
                    placeholder: 'اختر النسخة',
                    options: uniforms?.data?.map(record => ({label: record.type, value: record.id})),
                    disabled: !canFetchTypes || isLoadingTypes,
                    required: true
                }, {
                    ...StudentHelper.FIELDS.STUDENT.NAME_IN_ARABIC, name: 'student_name', label: 'اسم الطالب'
                }, {
                    name: "quantity", type: "number", required: true, label: "الكمية", placeholder: "الكمية"
                }]}
                onFormSubmit={onSubmit}
                btnText="صرف"
            />
        </Page>
    </>);
}

