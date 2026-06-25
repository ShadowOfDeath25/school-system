import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import {useState} from "react";

import {ClassroomHelper} from "@utils/helpers/ClassroomHelper.js";

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
                        label: "Ø§Ù„Ù…Ø±Ø­Ù„Ø©",
                        type: "select",
                        placeholder: "Ø§Ø®ØªØ± Ø§Ù„Ù…Ø±Ø­Ù„Ø©",
                        options: ClassroomHelper.LEVELS
                    },
                    {
                        name: "grade",
                        type: "select",
                        label: "Ø§Ù„ØµÙ",
                        dependency: 'level',
                        placeholder: "Ø§Ø®ØªØ± Ø§Ù„ØµÙ",
                        options: ClassroomHelper.getGradeOptionsByLevel,
                        disabled: (value) => !value
                    },
                ]}
            />
            <Table
                resource={"exams"}
                filters={filters}
                fields={[
                    {name: "name", label: "Ø§Ø³Ù… Ø§Ù„Ø§Ø®ØªØ¨Ø§Ø±", editable: false},
                    {name: "type", label: "Ù†ÙˆØ¹ Ø§Ù„Ø§Ø®ØªØ¨Ø§Ø±", editable: false},
                    {name: "component_name", label: "مكون الدرجات", editable: false},
                    {
                        name: "marks",
                        label: "Ø§Ù„Ø¯Ø±Ø¬Ø© Ø§Ù„Ø¹Ø¸Ù…ÙŠ",
                        editable:false,
                        type: "number",
                        required: true,
                        placeholder: "Ø§Ù„Ø¯Ø±Ø¬Ø© Ø§Ù„Ø¹Ø¸Ù…ÙŠ",
                    },
                    {
                        name: "date",
                        label: "Ù…ÙˆØ¹Ø¯ Ø§Ù„Ø§Ø®ØªØ¨Ø§Ø±",
                        type: "datetime-local",
                        required: true,
                        viewable: false
                    },
                    {name: "formatted_date", label: "Ù…ÙˆØ¹Ø¯ Ø§Ù„Ø§Ø®ØªØ¨Ø§Ø±", editable: false},
                    {
                        name: "duration_in_hours",
                        label: "Ù…Ø¯Ø© Ø§Ù„Ø§Ø®ØªØ¨Ø§Ø±",
                        type: "number",
                        required: true,
                        placeholder: "Ù…Ø¯Ø© Ø§Ù„Ø§Ø®ØªØ¨Ø§Ø±"
                    },
                ]}
            />
        </Page>
    );
}