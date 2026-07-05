import Page from "@ui/Page/Page.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import Table from "@ui/Table/Table.jsx";
import { useState } from "react";
import { ClassroomHelper } from "@helpers/ClassroomHelper.js";

export default function ViewSeatNumbers() {
    const [filters, setFilters] = useState();
    const filterFields = [
        {
            ...ClassroomHelper.FIELDS.LANGUAGE,
            type: "select"
        },
        ClassroomHelper.FIELDS.LEVEL,
        ClassroomHelper.FIELDS.GRADE
    ]
    return (
        <>
            <Page>
                <Filters
                    resource={'seat-numbers'}
                    onSubmit={(filters) => setFilters(filters)}
                    fields={filterFields}
                />
                <Table
                    resource={'seat-numbers'}
                    filters={filters}
                    editable={false}
                />
            </Page>
        </>
    );
}

