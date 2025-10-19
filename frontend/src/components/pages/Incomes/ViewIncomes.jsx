import Page from "@ui/Page/Page.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import Table from "@ui/Table/Table.jsx";
import {useState} from "react";

export default function ViewIncomes() {
    const [filters, setFilters] = useState();
    return (
        <>
            <Page>
                <Filters
                    resource={'incomes'}
                    onSubmit={(filters) => setFilters(filters)}
                />
                <Table
                    resource={'incomes'}
                    editable={false}
                    filters={filters}
                />
            </Page>
        </>
    );
}

