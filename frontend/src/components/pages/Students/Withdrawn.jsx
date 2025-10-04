import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import {useGetAll, useUpdate} from "@hooks/api/useCrud.js";
import {useState} from "react";
import {Button} from "@mui/material";
import {useEditModal} from "@contexts/EditModalContext.jsx";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import {classroomHelper} from "@utils/classroomHelper.js";
import {getAcademicYears} from "@utils/getAcademicYears.js";

export default function Withdrawn() {
    const {data: classrooms} = useGetAll('classrooms', {all: 'true'});
    const [filters, setFilters] = useState();
    const mutation = useUpdate('students');
    const {showEditModal, hideEditModal} = useEditModal();
    const {showSnackbar} = useSnackbar();
    const filterFields = [
        {
            name: "classroom.level",
            type: "select",
            options: classroomHelper.LEVELS,
            label: "المرحلة",
            placeholder: "اختر المرحلة"
        },
        {
            name: "classroom.grade",
            type: 'select',
            dependency: "classroom.level",
            options: classroomHelper.getGradeOptionsByLevel,
            disabled: (values) => !values,
            label: 'الصف',
            placeholder: 'اختر الصف'
        },
        {
            name: "classroom",
            type: "select",
            multiple: true,
            placeholder: "اختر الفصل",
            label: "الفصل",
            disabled: (values) => {
                let disabled = false;
                values.forEach(value => {
                    if (value === undefined || value === null) {
                        disabled = true;
                    }
                });
                return disabled;
            },
            options: (values) => {
                let [grade, level] = values;
                return [...new Set(classrooms?.data?.filter(classroom => classroom.GRADE === grade?.[0] && classroom.LEVEL === level).map(classroom => classroom.name))]
            },

            dependency: ["classroom.grade", "classroom.level"]
        }
    ]
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
                    options: classroomHelper.LANGUAGES,
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
                    options: (value) => classrooms?.data.filter(classroom => classroom.ACADEMIC_YEAR === value[0] && classroom.LANGUAGE === value[1])
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

    return (
        <Page>
            <Filters
                resource={"students"}
                onSubmit={(filters) => setFilters({withdrawn: true, ...filters})}
                fields={filterFields}
            />
            <Table
                resource={"students"}
                filters={filters}
                fields={[{name: "reg_number"}, {name: "name_in_arabic", label: "الاسم"}, {name: "classroom"}]}
                children={enrollButton}
                editable={false}
            />
        </Page>
    );
}

