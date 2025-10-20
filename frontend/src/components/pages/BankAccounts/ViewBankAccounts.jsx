import Page from "@ui/Page/Page.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import {useState} from "react";
import Table from "@ui/Table/Table.jsx";

export default function ViewBankAccounts() {
    const [filters, setFilters] = useState();
    return (
        <>
            <Page>
                <Filters
                    resource={'bank-accounts'}
                    onSubmit={(filters) => setFilters(filters)}
                />
                <Table
                    resource={'bank-accounts'}
                    filters={filters}
                    editable={false}
                />
            </Page>
        </>
    );
}

