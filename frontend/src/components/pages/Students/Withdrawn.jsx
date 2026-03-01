import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import { useGetAll, useUpdate } from "@hooks/api/useCrud.js";
import { useState } from "react";
import { Button } from "@mui/material";
import { useInputModal } from "@contexts/InputModalContext.jsx";
import { useSnackbar } from "@contexts/SnackbarContext.jsx";
import { ClassroomHelper } from "@utils/helpers/ClassroomHelper.js";

export default function Withdrawn() {
    const { data: classrooms } = useGetAll('classrooms', { all: 'true' });
    const { data: academicYears = [] } = useGetAll('academic-years', {}, {
        select: (data) => data?.data?.map((academicYear) => academicYear.name)
    });
    const [filters, setFilters] = useState();
    const mutation = useUpdate('students');
    const { showEditModal, hideEditModal } = useInputModal();
    const { showSnackbar } = useSnackbar();
    const filterFields = [
        {
            name: "classroom.level",
            type: "select",
            options: ClassroomHelper.LEVELS,
            label: "المرحلة",
            placeholder: "اختر المرحلة"
        },
        {
            name: "classroom.grade",
            type: 'select',
            dependency: "classroom.level",
            options: ClassroomHelper.getGradeOptionsByLevel,
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
                { ...ClassroomHelper.FIELDS.ACADEMIC_YEAR, options: academicYears },
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
                        .map(classroom => ({ label: classroom.name, value: classroom.id }))

                }
            ],
            item: student, onSave: (payload) => {
                mutation.mutate({ classroom_id: payload.classroom, id: student.id }, {
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
                onSubmit={(filters) => setFilters(filters)}
                fields={filterFields}
            />
            <Table
                resource={"students"}
                filters={filters}
                params={{ withdrawn: true }}
                fields={[{ name: "reg_number" }, { name: "name_in_arabic", label: "الاسم" }, { name: "classroom.name" }]}
                children={enrollButton}
                editable={false}
            />
        </Page>
    );
}

