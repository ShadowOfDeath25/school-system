import Page from "@ui/Page/Page.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import Table from "@ui/Table/Table.jsx";
import {ClassroomHelper} from "@helpers/ClassroomHelper.js";
import {useState} from "react";

export default function ViewBooks() {
    const [filters, setFilters] = useState();
    return (
        <>
            <Page>
                <Filters
                    resource={'books'}
                    additionalFields={[
                        ClassroomHelper.FIELDS.LEVEL,
                        ClassroomHelper.FIELDS.GRADE,
                        ClassroomHelper.FIELDS.LANGUAGE
                    ]}
                    onSubmit={(filters) => setFilters(filters)}
                />
                <Table
                    resource={"books"}
                    editFields={[
                        {
                            name: "price",
                            label: "السعر",
                            type: "number",
                            required: true,
                            placeholder: "السعر"
                        },
                        {
                            name: "imported_quantity",
                            label: "الكمية الواردة",
                            type: "number",
                            required: true,
                            placeholder: "السعر"
                        },
                    ]}
                    filters={filters}

                />
            </Page>
        </>
    );
}

