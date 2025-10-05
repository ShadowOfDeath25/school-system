import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import {useState} from "react";
import {ClassroomHelper} from "@utils/helpers/ClassroomHelper.js";


export default function ViewSubjects() {
    const [filters, setFilters] = useState({});

    const filterFields = [
        ClassroomHelper.FIELDS.LEVEL,
        ClassroomHelper.FIELDS.GRADE
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
