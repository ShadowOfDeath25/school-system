import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import {useState} from "react";

import {classroomHelper} from "@utils/classroomHelper.js";

export default function ViewClassrooms() {
    const [filters, setFilters] = useState({});
    const filterFields = [
        classroomHelper.FIELDS.LEVEL,
        classroomHelper.FIELDS.GRADE
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
            options: classroomHelper.LANGUAGES,
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
