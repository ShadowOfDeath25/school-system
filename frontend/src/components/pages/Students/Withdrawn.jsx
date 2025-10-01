import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import {useGetAll} from "@hooks/api/useCrud.js";
import {getGradeOptionsByLevel} from "@utils/getGradeOptionsByLevel.js";
import {useState} from "react";
import {Button} from "@mui/material";

export default function Withdrawn() {
    const {data: classrooms} = useGetAll('classrooms', {all: 'true'});
    const [filters, setFilters] = useState();
    const filterFields = [
        {
            name: "classroom.level",
            type: "select",
            options: ["رياض اطفال", "ابتدائي", "اعدادي"],
            label: "المرحلة",
            placeholder: "اختر المرحلة"
        },
        {
            name: "classroom.grade",
            type: 'select',
            dependency: "classroom.level",
            options: getGradeOptionsByLevel,
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
                return [...new Set(classrooms?.data?.filter(classroom => classroom.grade === grade?.[0] && classroom.level === level).map(classroom => classroom.name))]
            },

            dependency: ["classroom.grade", "classroom.level"]
        }
    ]
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
                onSubmit={(filters) => setFilters(prev => ({withdrawn: true, ...filters}))}
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

