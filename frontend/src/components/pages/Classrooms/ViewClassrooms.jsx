import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import {useState} from "react";
import {getGradeOptionsByLevel} from "@utils/getGradeOptionsByLevel.js";
import {CLASSROOMS} from "@constants/classrooms.js";

export default function ViewClassrooms() {
    const [filters, setFilters] = useState({});
    const filterFields = [
        {
            name: "level",
            type: 'select',
            label: 'المرحلة',
            placeholder: 'اختر المرحلة',
            options: CLASSROOMS.LEVELS
        },
        {
            name: "grade",
            type: 'select',
            multiple: true,
            options: getGradeOptionsByLevel,
            dependency: "level",
            disabled: (value) => !value,
            label: 'الصف',
            placeholder: 'اختر الصف'

        }
    ]
    const fields = [
        {
            name: "name",
            editable: false
        },
        {
            name: "academic_year",
            editable: false
        },
        {
            name: "language",
            type: "select",
            required: true,
            options: CLASSROOMS.LANGUAGES,
            label: "اللغة",
            placeholder: "اختر اللغة"
        },
        {
            name: "max_capacity",
            type: "number",
            placeholder: "الطاقة الإستيعابية",
            label: "الطاقة الإستيعابية",
            required: true
        },
        {
            name: "capacity",
            editable: false
        },
        {
            name: "occupancy",
            editable: false
        },
    ]


    return (
        <>
            <Page>
                <Filters
                    resource={"classrooms"}
                    onSubmit={(filter) => setFilters(filter)}
                    fields={filterFields}
                />
                <Table
                    resource={"classrooms"}
                    filters={filters}
                    fields={fields}

                />


            </Page>
        </>
    );
}
