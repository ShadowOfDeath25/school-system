import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import {Button} from "@mui/material";
import {useGetAll, useUpdate} from "@hooks/api/useCrud.js";
import {useEditModal} from "@contexts/EditModalContext.jsx";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import {getAcademicYears} from "@utils/getAcademicYears.js";

export default function NotEnrolled() {
    const mutation = useUpdate('students', {all: true});
    const {showEditModal, hideEditModal} = useEditModal();
    const {showSnackbar} = useSnackbar();
    const {data: classrooms} = useGetAll('classrooms');

    const handleEnroll = (student) => {
        showEditModal({
            fields: [
                {
                    name: 'academic_year',
                    type: 'select',
                    label: 'السنة الدراسية',
                    options: getAcademicYears(),
                    placeholder: "اختر السنة الدراسية",
                    required: true
                },
                {
                    name: "language",
                    type: "select",
                    label: "اللغة",
                    options: ["عربي", "لغات"],
                    required: true,
                    placeholder: "اختر اللغة"
                },
                {
                    name: "classroom",
                    type: "select",
                    label: "الفصل",
                    placeholder: 'اختر فصل',
                    required: true,
                    dependency: ["academic_year", 'language'],
                    disabled: (values) => values.some(value => !value),
                    options: (value) => classrooms?.data.filter(classroom => classroom.academic_year === value[0] && classroom.language === value[1])
                        .map(classroom => ({label: classroom.name, value: classroom.id}))

                }
            ],
            item: student, onSave: (payload) => {
                mutation.mutate({classroom_id: payload.classroom, id: student.id}, {
                    onSuccess: () => {
                        showSnackbar('تم الحاق الطالب بالفصل بنجاح')
                        hideEditModal();
                    }, onError: () => {
                        showSnackbar('حدث خطأ اثناء الحاق الطالب بالفصل', 'error')
                        hideEditModal()
                    },
                })
            }
        })
    }
    const enrollButton = {
        header: "الحاق بفصل", content: (student) => <Button
            onClick={() => handleEnroll(student)}
            variant={"contained"}
            color={"primary"}

        >
            الحاق بفصل
        </Button>
    }
    return (<>
        <Page>
            <Table
                resource={"students"}
                filters={{classroom: "null"}}
                children={enrollButton}
                editable={false}
                fields={[{name: "name_in_arabic", label: "الاسم"}, {name: "birth_date"}, {name: "nid"}]}
            >

            </Table>


        </Page>
    </>);
}

