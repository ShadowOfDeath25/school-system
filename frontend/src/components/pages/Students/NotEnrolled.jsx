import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import {Button} from "@mui/material";
import {useGetAll, useUpdate} from "@hooks/api/useCrud.js";
import {useInputModal} from "@contexts/InputModalContext.jsx";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import {getAcademicYears} from "@utils/getAcademicYears.js";
import {ClassroomHelper} from "@helpers/ClassroomHelper.js";

export default function NotEnrolled() {
    const mutation = useUpdate('students', {all: true});
    const {showEditModal, hideEditModal} = useInputModal();
    const {showSnackbar} = useSnackbar();
    const {data: classrooms} = useGetAll('classrooms');

    const handleEnroll = (student) => {
        showEditModal({
            fields: [
                ClassroomHelper.FIELDS.ACADEMIC_YEAR,
                ClassroomHelper.FIELDS.LANGUAGE,
                ClassroomHelper.FIELDS.LEVEL,
                ClassroomHelper.FIELDS.GRADE,
                {
                    name: "classroom",
                    type: "select",
                    label: "الفصل",
                    placeholder: 'اختر فصل',
                    required: true,
                    dependency: ["academic_year", 'language', 'level', 'grade'],
                    disabled: (values) => values.some(value => !value),
                    options: (value) => classrooms?.data.filter(classroom => classroom.academic_year === value[0] && classroom.language === value[1] && classroom.level === value[2] && classroom.grade === value[3])
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

