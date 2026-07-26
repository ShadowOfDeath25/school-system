import Page from "@ui/Page/Page.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import Table from "@ui/Table/Table.jsx";
import { useState } from "react";
import { Button } from "@mui/material";
import { ClassroomHelper } from "@utils/helpers/ClassroomHelper.js";
import { useInputModal } from "@contexts/InputModalContext.jsx";
import { useConfirmModal } from "@contexts/ConfirmModalContext.jsx";
import { useSnackbar } from "@contexts/SnackbarContext.jsx";
import { useGetAll } from "@hooks/api/useCrud.js";
import axiosClient from "../../../axiosClient.js";

export default function TransferOut() {
    const [tableFilters, setTableFilters] = useState(null);
    const { showInputModal, hideInputModal } = useInputModal();
    const { confirm } = useConfirmModal();
    const { showSnackbar } = useSnackbar();
    const { data: classrooms } = useGetAll("classrooms", { all: "true" });

    const filterFields = [
        {
            ...ClassroomHelper.FIELDS.LEVEL,
            name: "classroom.level",
        },
        {
            ...ClassroomHelper.FIELDS.GRADE,
            name: "classroom.grade",
            dependency: "classroom.level",
        },
        {
            ...ClassroomHelper.FIELDS.CLASSROOM,
            options: (values) => {
                let [grade, level] = values;
                if (!grade || !level || !classrooms?.data) return [];
                return [...new Set(classrooms.data.filter(classroom => classroom.grade === grade && classroom.level === level).map(classroom => classroom.name))]
            },
        }
    ];

    const tableFields = [
        { name: "reg_number", label: "رقم القيد" },
        { name: "name_in_arabic", label: "الاسم" },
        { name: "classroom.name", label: "الفصل" },
        { name: "status", label: "حالة القيد" },
        { name: "language", label: "اللغة" },
    ];

    const handleTransfer = (student) => {
        showInputModal({
            fields: [
                {
                    name: "other_school_name",
                    type: "text",
                    label: "اسم المدرسة",
                    placeholder: "اسم المدرسة المراد التحويل إليها",
                    required: true,
                },
                {
                    name: "notes",
                    type: "text",
                    label: "السبب",
                    placeholder: "سبب التحويل (اختياري)",
                }
            ],
            item: student,
            buttonText: "تحويل",
            onSave: async (formData) => {
                const confirmed = await confirm({
                    message: `هل أنت متأكد من تحويل الطالب "${student.name_in_arabic}" إلى مدرسة "${formData.other_school_name}"؟`,
                    warning: 'سيتم إلغاء قيد الطالب من الفصل الحالي',
                });
                if (!confirmed) return;

                try {
                    await axiosClient.post("/transfers/outgoing", {
                        student_id: student.id,
                        other_school_name: formData.other_school_name,
                        notes: formData.notes || null,
                    });
                    showSnackbar("تم تحويل الطالب بنجاح");
                    hideInputModal();
                } catch (err) {
                    const msg = err.response?.data?.message || "حدث خطأ أثناء تحويل الطالب";
                    showSnackbar(msg, "error");
                }
            }
        });
    };

    const transferButton = {
        header: "تحويل",
        content: (student) => (
            student.classroom ? (
                <Button
                    onClick={() => handleTransfer(student)}
                    variant="contained"
                    sx={{ backgroundColor: "var(--btn-danger-bg)" }}
                >
                    تحويل
                </Button>
            ) : null
        )
    };

    return (
        <Page>
            <Filters
                resource={"students"}
                onSubmit={(filter) => setTableFilters(filter)}
                fields={filterFields}
            />
            <Table
                resource={"students"}
                filters={tableFilters}
                fields={tableFields}
                editable={false}
                deletable={false}
            >
                {transferButton}
            </Table>
        </Page>
    );
}
