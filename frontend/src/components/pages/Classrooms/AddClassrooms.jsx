import Page from "@ui/Page/Page.jsx";
import Form from "@ui/Form/Form.jsx";
import {useCreate, useGetAll} from "@hooks/api/useCrud.js";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import {useState} from "react";
import {useAcademicYears} from "@hooks/useAcademicYears.js";


const gradeOptionsByLevel = {
    "رياض اطفال": [
        {label: "الأول", value: 1},
        {label: "الثاني", value: 2},
    ],
    "ابتدائي": [
        {label: "الاول", value: 1},
        {label: "الثاني", value: 2},
        {label: "الثالث", value: 3},
        {label: "الرابع", value: 4},
        {label: "الخامس", value: 5},
        {label: "السادس", value: 6},
    ],
    "اعدادي": [
        {label: "الأول", value: 1},
        {label: "الثاني", value: 2},
        {label: "الثالث", value: 3},
    ],
};

export default function AddClassrooms() {
    const creationMutation = useCreate("classrooms");
    const {showSnackbar} = useSnackbar();
    const [serverErrors, setServerErrors] = useState(null);

    const fields = [
        {
            fields: [
                {
                    name: "level",
                    label: "المرحلة",
                    placeholder: "اختر مرحلة",
                    type: "select",
                    required: true,
                    options: [
                        {label: "رياض اطفال", value: "رياض اطفال"},
                        {label: "ابتدائي", value: "ابتدائي"},
                        {label: "اعدادي", value: "اعدادي"},
                    ]
                },
                {
                    name: "language",
                    label: "اللغة",
                    placeholder: "اختر اللغة",
                    type: "radio",
                    required: true,
                    options: [
                        {label: "عربي", value: "عربي"},
                        {label: "لغات", value: "لغات"}
                    ]
                },
                {
                    name: "academic_year",
                    label: "العام الدراسي",
                    placeholder: "اختر العام الدراسي",
                    type: "select",
                    required: true,
                    options: useAcademicYears()
                },
                {
                    name: "max_capacity",
                    type: "number",
                    required: true,
                    placeholder: "الطاقة الاستيعابية",
                    label: "الطاقة الاستيعابية"
                },
                {
                    name: "grade",
                    placeholder: "اختر الصف",
                    label: "الصف",
                    type: "select",
                    required: true,
                    options: (formData) => gradeOptionsByLevel[formData.level] || [],
                    disabled: (formData) => !formData.level,
                },
                {
                    name: "floor_id",
                    placeholder: "اختر موقع الفصل",
                    label: "موقع الفصل",
                    type: "select",
                    required: true,
                    options: useGetAll("floors")
                        .data?.data.map((floor) => ({label: `${floor.name} - ${floor.building}`, value: floor.id}))

                },
                {
                    name: "leader",
                    placeholder: "رائد الفصل",
                    type: "text",
                    required: false,
                    label: "رائد الفصل"
                }
            ]
        }
    ]

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
                fields={fields}
                onFormSubmit={onFormSubmit}
                serverErrors={serverErrors}
            />
        </Page>
    );
}
