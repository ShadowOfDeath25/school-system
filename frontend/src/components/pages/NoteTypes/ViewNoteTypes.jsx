import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import {useCreate} from "@hooks/api/useCrud.js";
import {useInputModal} from "@contexts/InputModalContext.jsx";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import Button from "@mui/material/Button";

const fields = [
    {
        name: "name",
        label: "الاسم",
        type: "text",
        editable: true,
        required: true,
    },
    {
        name: "is_active",
        label: "مفعل",
        type: "select",
        editable: true,
        options: [
            {label: "نعم", value: true},
            {label: "لا", value: false},
        ],
        render: (row) => row.is_active ? "نعم" : "لا",
    },
];

export default function ViewNoteTypes() {
    const createMutation = useCreate("note-types");
    const {showInputModal, hideInputModal} = useInputModal();
    const {showSnackbar} = useSnackbar();

    const handleAdd = () => {
        showInputModal({
            fields: fields.filter(f => f.editable !== false),
            buttonText: "إضافة",
            onSave: (formData) => {
                createMutation.mutate(formData, {
                    onSuccess: () => {
                        showSnackbar("تم إضافة العلامة المميزة بنجاح");
                        hideInputModal();
                    },
                    onError: (error) => {
                        showSnackbar(error?.response?.data?.message || "حدث خطأ أثناء الإضافة", "error");
                    }
                });
            },
            isLoading: createMutation.isLoading,
        });
    };

    return (
        <Page>
            <Button
                onClick={handleAdd}
                variant="contained"
                sx={{mb: 2}}
            >
                إضافة علامة مميزة
            </Button>
            <Table
                resource={"note-types"}
                fields={fields}
                searchable={true}
            />
        </Page>
    );
}
