import Table from "@ui/Table/Table.jsx";
import Page from "@ui/Page/Page.jsx";
import Form from "@ui/Form/Form.jsx";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import {useInputModal} from "@contexts/InputModalContext.jsx";
import {useCreate, useGetAll, useUpdate} from "@hooks/api/useCrud.js";
import {useState} from "react";

export default function ViewGradeAges() {
    const {showSnackbar} = useSnackbar();
    const {showInputModal, hideInputModal} = useInputModal();
    const createMutation = useCreate('grade-ages');
    const updateMutation = useUpdate('grade-ages');
    const [serverErrors, setServerErrors] = useState();

    const {data: grades} = useGetAll('grades', {all: true}, {
        select: (data) => data?.data?.map(g => ({
            label: g.name,
            value: g.id
        }))
    });

    const normalize = (data) => ({
        ...data,
        max_years: data.max_years === '' ? null : data.max_years,
        max_months: data.max_months === '' ? null : data.max_months,
    });

    const onSubmit = (data, options) => {
        setServerErrors(null);
        createMutation.mutate(normalize(data), {
            onSuccess: () => {
                showSnackbar("تمت إضافة العمر بنجاح");
                options.resetForm();
            },
            onError: (error) => {
                setServerErrors(error?.response?.data?.errors);
                showSnackbar('حدث خطأ أثناء إضافة العمر', "error");
            }
        });
    };

    const handleEdit = (item) => {
        const modalFields = [
            {name: "min", label: "الحد الأدنى للعمر", type: "age", required: true},
            {name: "max", label: "الحد الأقصى للعمر", type: "age", required: false},
        ];

        showInputModal({
            fields: modalFields,
            item: item,
            onSave: (formData) => {
                updateMutation.mutate({...normalize(formData), id: item.id}, {
                    onSuccess: () => {
                        showSnackbar("تم تحديث العمر بنجاح");
                        hideInputModal();
                    },
                    onError: () => {
                        showSnackbar("حدث خطأ أثناء تحديث العمر", "error");
                    }
                });
            },
        });
    };

    return (
        <Page>
            <Form
                fields={[
                    {
                        name: "grade_id",
                        label: "الصف الدراسي",
                        type: "select",
                        required: true,
                        placeholder: 'اختر الصف',
                        options: grades,
                    },
                    {
                        name: "min",
                        label: "الحد الأدنى للعمر",
                        type: "age",
                        required: true,
                    },
                    {
                        name: "max",
                        label: "الحد الأقصى للعمر",
                        type: "age",
                        required: false,
                    },
                ]}
                title={"إضافة عمر للصف الدراسي"}
                onFormSubmit={onSubmit}
                serverErrors={serverErrors}
            />
            <Table
                resource={"grade-ages"}
                fields={[
                    {name: "grade_name", label: "الصف الدراسي", editable: false},
                    {name: "min_display", label: "الحد الأدنى", editable: false},
                    {name: "max_display", label: "الحد الأقصى", editable: false},
                ]}
                handleEdit={handleEdit}
            />
        </Page>
    );
}
