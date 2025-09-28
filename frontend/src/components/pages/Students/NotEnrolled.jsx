import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import {Button} from "@mui/material";
import {useGetAll, useUpdate} from "@hooks/api/useCrud.js";
import {useEditModal} from "@contexts/EditModalContext.jsx";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";

export default function NotEnrolled() {
    const mutation = useUpdate('students');
    const {showEditModal, hideEditModal} = useEditModal();
    const {showSnackbar} = useSnackbar();
    const {data: classrooms} = useGetAll('classrooms');

    const handleEnroll = (student) => {
        showEditModal({
            fields: [{
                name: "classroom",
                type: "select",
                label: "الفصل",
                placeholder: 'اختر فصل',
                options: classrooms?.data.map(classroom => ({label: classroom.name, value: classroom.id}))
            }],
            item: student,
            onSave: (payload) => {
                mutation.mutate({clasroom_id: payload.classroom, id: student.id}, {
                    onSuccess: () => {
                        showSnackbar('تم الحاق الطالب بالفصل بنجاح')
                        hideEditModal();
                    },
                    onError: () => {
                        showSnackbar('حدث خطأ اثناء الحاق الطالب بالفصل', 'error')
                        hideEditModal()
                    },
                })
            }
        })
    }
    const enrollButton = {
        header: "الحاق بفصل",
        content: (student) =>
            <Button
                onClick={() => handleEnroll(student)}
                variant={"contained"}
                color={"primary"}

            >
                الحاق بفصل
            </Button>
    }
    return (
        <>
            <Page>
                <Table
                    resource={"students"}
                    params={{classroom: "null"}}
                    children={enrollButton}
                    editable={false}
                >

                </Table>


            </Page>
        </>);
}

