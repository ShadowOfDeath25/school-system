import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import {useState} from "react";

import {classroomHelper} from "@utils/classroomHelper.js";

export default function ViewExams() {
    const [filters, setFilters] = useState();

    return (
        <Page>
            <Filters
                resource={"exams"}
                onSubmit={(filters) => setFilters(filters)}
                additionalFields={[
                    {
                        name: "level",
                        label: "المرحلة",
                        type: "select",
                        placeholder: "اختر المرحلة",
                        options: classroomHelper.LEVELS
                    },
                    {
                        name: "grade",
                        type: "select",
                        label: "الصف",
                        dependency: 'level',
                        placeholder: "اختر الصف",
                        options: classroomHelper.getGradeOptionsByLevel,
                        disabled: (value) => !value
                    },
                ]}
            />
            <Table
                resource={"exams"}
                filters={filters}
                fields={[
                    {name: "name", label: "اسم الاختبار", editable: false},
                    {name: "type", label: "نوع الاختبار", editable: false},
                    {
                        name: "min_marks",
                        label: "الدرجة الصغري",
                        type: "number",
                        required: true,
                        placeholder: "الدرجة الصغري"
                    },
                    {
                        name: "max_marks",
                        label: "الدرجة العظمي",
                        type: "number",
                        required: true,
                        placeholder: "الدرجة العظمي",
                    },
                    {
                        name: "date",
                        label: "موعد الاختبار",
                        type: "datetime-local",
                        required: true,
                        viewable: false
                    },
                    {name: "formatted_date", label: "موعد الاختبار", editable: false},
                    {
                        name: "duration_in_hours",
                        label: "مدة الاختبار",
                        type: "number",
                        required: true,
                        placeholder: "مدة الاختبار"
                    },
                ]}
            />
        </Page>
    );
}
