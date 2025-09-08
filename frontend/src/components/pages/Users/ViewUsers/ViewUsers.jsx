import Page from "@ui/Page/Page.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import {useState} from "react";
import Table from "@ui/Table/Table.jsx";

export default function ViewUsers() {
    const breadcrumbs = [
        <span>المستخدمين</span>,
        <span>عرض المستخدمين</span>
    ]

    const [filters, setFilters] = useState({});
    const onSubmit = (filters) => {
        setFilters(filters);

    }

    return (
        <>
            <Page title={"عرض المستخدمين"} breadcrumbs={breadcrumbs}>
                <Filters

                    resource={"users"}
                    onSubmit={onSubmit}
                    fields={["roles"]}
                />
                <Table
                    resource={"users"}
                    filters={filters}
                    fields={["name", "email", "roles"]}
                />
            </Page>
        </>
    );
}

