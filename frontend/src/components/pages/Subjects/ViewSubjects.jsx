import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import {getGradeOptionsByLevel} from "@utils/getGradeOptionsByLevel.js";
import {useState} from "react";


export default function ViewSubjects() {
    const [filters, setFilters] = useState({});
    const editableFields = [
        [
            {
                name: "max_marks",
                type: 'number',
                label: "الدرجة العظمي",
                placeholder: "الدرجة العظمي",
                required: true
            },
            {
                name: "min_marks",
                type: 'number',
                label: "الدرجة الصغري",
                placeholder: "الدرجة الصغري",
                required: true
            }
        ]
    ]
    const filterFields = [
        {
            name: "level",
            type: "select",
            label: "المرحلة",
            placeholder: "اختر المرحلة",
            options: ['رياض اطفال', "ابتدائي", "اعدادي"]
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
                    onSubmit={(filters)=>setFilters(filters)}
                />

                <Table
                    editFields={editableFields}
                    resource={"subjects"}
                    fields={[{name: "name"}, {name: "semester"}, {name: "max_marks"}, {name: "added_to_total"}]}
                    filters={filters}
                />
            </Page>
        </>
    );
}
