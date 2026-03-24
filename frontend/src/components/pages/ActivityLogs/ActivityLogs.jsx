import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import {useState} from "react";

export default function ActivityLogs() {
    const [filters, setFilters] = useState(
        {
            start_date: null,
            end_date: null
        }
    );
    console.log(filters)

    return (
        <Page>
            <Filters
                resource={"activity-logs"}
                additionalFields={[
                    {
                        name: "start_date",
                        label: "بعد",
                        type: "date",
                        format: "Y-m-d",
                        max: (f) => f?.end_date || null
                    },
                    {
                        name: "end_date",
                        label: "قبل",
                        type: "date",
                        min: (f) => f?.start_date || null
                    }
                ]}
                onSubmit={(data) => {
                    let newFilters = { ...data };
                    if (newFilters.start_date && newFilters.end_date && newFilters.start_date > newFilters.end_date) {
                        const temp = newFilters.start_date;
                        newFilters.start_date = newFilters.end_date;
                        newFilters.end_date = temp;
                    }
                    setFilters(newFilters);
                }}

            />
            <Table
                resource={"activity-logs"}
                editable={false}
                searchable={false}
                filters={filters}
            />
        </Page>
    );
}

