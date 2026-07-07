import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import { useState } from "react";

export default function ViewExamHalls() {
    const [filters, setFilters] = useState();
    const fields = [
        { name: "number" },
        { name: "capacity" },
        { name: "academic_year" },
    ];

    return (
        <Page>
            <Filters
                resource={"exam-halls"}
                onSubmit={(filters) => setFilters(filters)}
                removedFields={["classroom.level", "classroom.grade", "classroom.language"]}
            />
            <Table
                resource={"exam-halls"}
                filters={filters}
                fields={fields}
            />
        </Page>
    );
}
