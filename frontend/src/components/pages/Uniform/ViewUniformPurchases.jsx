import {useState} from "react";
import Page from "@ui/Page/Page.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import Table from "@ui/Table/Table.jsx";

export default function ViewUniformPurchases() {
    const [filters, setFilters] = useState();
    return (
        <>
            <Page>
                <Filters
                    resource={'uniform-purchases'}
                    onSubmit={(filters) => setFilters(filters)}
                    labels={{
                        "uniform.academic_year": "السنة الدراسية",
                        "uniform.type": "نوع الزي",
                    }}
                />
                <Table
                    resource={'uniform-purchases'}
                    filters={filters}
                    editable={false}
                    deletable={false}
                />
            </Page>
        </>
    );
}

