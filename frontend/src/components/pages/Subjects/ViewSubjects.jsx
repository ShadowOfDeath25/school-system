import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import {getGradeOptionsByLevel} from "@utils/getGradeOptionsByLevel.js";
import {useState} from "react";
import {CLASSROOMS} from "@constants/classrooms.js";


export default function ViewSubjects() {
    const [filters, setFilters] = useState({});

    const filterFields = [
        {
            name: "level",
            type: "select",
            label: "المرحلة",
            placeholder: "اختر المرحلة",
            options: CLASSROOMS.LEVELS
        },
        {
            name: "grade",
            type: "select",
            label: "الصف",
            placeholder: "اختر الصف",
            options: getGradeOptionsByLevel,
            disabled: (currentFilters) => !currentFilters?.level
        }
    ]
    return (
        <>
            <Page>
                <Filters
                    resource={"subjects"}
                    additionalFields={filterFields}
                    onSubmit={(filters) => setFilters(filters)}
                />

                <Table
                    resource={"subjects"}
                    fields={[
                        {name: "name", editable: false},
                        {name: "semester", editable: false},
                        {
                            name: "max_marks",
                            
                            type: "number",
                            required: true,
                            label: "الدرجة الكبري",
                            placeholder: "الدرجة الكبري"
                        },
                        {
                            name: "min_marks",
                            viewable: false,
                            type: "number",
                            required: true,
                            label: "الدرجة الصغري",
                            placeholder: "الدرجة الصغري"
                        },
                        {name: "added_to_total", editable: false}
                    ]}
                    filters={filters}
                />
            </Page>
        </>
    );
}
