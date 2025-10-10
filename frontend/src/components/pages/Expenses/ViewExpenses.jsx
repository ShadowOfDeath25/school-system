import Filter from '@ui/Filters/Filters.jsx'
import Table from "@ui/Table/Table.jsx";
import {useState} from "react";
import Page from "@ui/Page/Page.jsx";

export default function ViewExpenses() {
    const [filters, setFilters] = useState();

    return (
        <>
            <Page>
                <Filter
                    resource={'expenses'}
                    onSubmit={(filters) => setFilters(filters)}
                />

                <Table
                    resource={'expenses'}
                    filters={filters}
                    fields={[
                        {
                            name: "number",
                            label: "رقم المستند",
                        },
                        {
                            name: "formatted_date",
                            label: "التاريخ"
                        },
                        {
                            name: "description",
                            label: "البيان"
                        }
                    ]}
                    editable={false}
                />
            </Page>
        </>
    );
}

