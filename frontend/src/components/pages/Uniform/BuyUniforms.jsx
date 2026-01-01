import { useState } from "react";
import { useCreate, useGetAll } from "@hooks/api/useCrud.js";
import { useSnackbar } from "@contexts/SnackbarContext.jsx";
import Page from "@ui/Page/Page.jsx";
import Form from "@ui/Form/Form.jsx";
import { ClassroomHelper } from "@helpers/ClassroomHelper.js";
import { StudentHelper } from "@helpers/StudentHelper.js";
import { UniformHelper } from "@helpers/UniformHelper.js";

const initialFormValues = {
    academic_year: "",
    type: "",
    student_name: "",
    quantity: "",
    piece: ""
};

export default function BuyUniforms() {
    const [formValues, setFormValues] = useState(initialFormValues);
    const { academic_year, level, grade, semester } = formValues;
    const mutation = useCreate('uniform-purchases')
    const canFetchTypes = !!academic_year;
    const { showSnackbar } = useSnackbar();
    const { data: academicYears = [] } = useGetAll('academic-years');
    const { data: uniforms, isLoading: isLoadingTypes } = useGetAll('uniforms', {
        types: true, academic_year, level, grade, semester
    }, {
        enabled: canFetchTypes, placeholderData: []
    });

    const onSubmit = (data) => {
        mutation.mutate({
            uniform_id: data.piece, student_name: data.student_name, quantity: data.quantity
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
                fields={[
                    { ...ClassroomHelper.FIELDS.ACADEMIC_YEAR, options: academicYears }, {
                        name: 'type',
                        label: 'نوع الزي',
                        id: 'type',
                        type: 'select',
                        placeholder: 'اختر النسخة',
                        options: uniforms?.types,
                        disabled: !canFetchTypes || isLoadingTypes,
                        required: true
                    },
                    {
                        ...UniformHelper.FIELDS.PIECE,
                        type: "select",
                        options: uniforms?.data?.filter(record => record.type === formValues.type)?.map(record => ({
                            label: record.piece,
                            value: record.id
                        })),
                        dependency: "type",
                        disabled: !formValues.type
                    },
                    {
                        ...StudentHelper.FIELDS.STUDENT.NAME_IN_ARABIC, name: 'student_name', label: 'اسم الطالب'
                    }, {
                        name: "quantity", type: "number", required: true, label: "الكمية", placeholder: "الكمية"
                    },

                ]

                }
                onFormSubmit={onSubmit}
                btnText="صرف"
            />
        </Page>
    </>);
}

