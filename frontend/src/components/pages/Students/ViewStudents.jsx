import Page from "@ui/Page/Page.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import {useState} from "react";
import Table from "@ui/Table/Table.jsx";
import {useGetAll, useUpdate} from "@hooks/api/useCrud.js";
import {Button} from '@mui/material'
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import {useConfirmModal} from "@contexts/ConfirmModalContext.jsx";
import {classroomHelper} from "@utils/classroomHelper.js";
import {studentHelper} from "@utils/studentHelper.js";

export default function ViewStudents() {
    const [tableFilters, setTableFilters] = useState(null);
    const {data: classrooms} = useGetAll("classrooms", {all: "true"});
    const mutation = useUpdate('students');
    const fields = [
        {
            name: "reg_number",
            label: "رقم القيد"
        },
        {
            name: 'name_in_arabic',
            label: 'الاسم'
        },
        {
            name: 'nid',
            label: 'الرقم القومي'
        },
        {
            name: 'status',
            label: 'حالة القيد'
        },
        {
            name: "classroom",
            label: "الفصل"
        },
        {
            name: "language",
            label: "اللغة"
        }
    ]
    const {showSnackbar} = useSnackbar();
    const {confirm} = useConfirmModal();

    const filterFields = [
        {
            ...classroomHelper.FIELDS.LEVEL,
            name: "classroom.level",
        },
        {
            ...classroomHelper.FIELDS.GRADE,
            name: "classroom.grade",
            dependency: "classroom.level",
        },
        {
            ...classroomHelper.FIELDS.CLASSROOM,
            options: (values) => {
                let [grade, level] = values;
                if (!grade || !level || !classrooms?.data) return [];
                return [...new Set(classrooms.data.filter(classroom => classroom.grade === grade && classroom.level === level).map(classroom => classroom.name))]
            },

        }

    ]
    const handleWithdraw = async (student) => {
        const confirmed = await confirm({message: "هل أنت متأكد من سحب ملف هذا الطالب ؟"})
        if (confirmed) {

            mutation.mutate({id: student.id, withdrawn: true}, {
                onSuccess: () => {
                    showSnackbar("تم سحب ملف الطالب بنجاح")
                },
                onError: (error) => {
                    showSnackbar("حدث خطأ أثناء سحب الملف", "error")
                }
            })
        }
    }
    const enrollButton = {
        header: "سحب الملف", content: (student) => <Button
            onClick={() => handleWithdraw(student)}
            variant={"contained"}
            sx={{backgroundColor: "var(--color-danger)"}}

        >
            سحب الملف
        </Button>
    }
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
                fields={fields}
                editFields={studentHelper.getAllFields()}
            >
                {enrollButton}
            </Table>
        </Page>
    );
}
