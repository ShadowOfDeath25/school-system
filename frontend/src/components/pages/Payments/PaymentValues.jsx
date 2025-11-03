import Page from "@ui/Page/Page.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import Table from "@ui/Table/Table.jsx";
import {useState} from "react";
import {ClassroomHelper} from "@helpers/ClassroomHelper.js";

export default function PaymentValues() {
    const [filters, setFilters] = useState();

    return (
        <Page>
            <Filters
                resource={'payment-values'}
                onSubmit={(filters) => setFilters(filters)}
                additionalFields={[
                    ClassroomHelper.FIELDS.LEVEL,
                ]}
            />
            <Table
                resource={'payment-values'}
                filters={filters}
                deletable={false}
                editFields={[
                    {
                        name: "value",
                        type: "number",
                        min: 0,
                        placeholder: "القيمة",
                        label: "القيمة"
                    }
                ]}
            />
        </Page>
    );
}

