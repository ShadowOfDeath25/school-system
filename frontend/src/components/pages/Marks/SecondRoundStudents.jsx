import { useState } from "react";
import { useNavigate } from "react-router";
import Page from "@ui/Page/Page.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import Table from "@ui/Table/Table.jsx";

export default function SecondRoundStudents() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({});

    return (
        <Page>
            <Filters
                resource={"marks/second-round"}
                onSubmit={(f) => setFilters(f)}
                labels={{ academic_year: "العام الدراسي" }}
            />
            <Table
                resource={"marks/second-round/students"}
                filters={filters}
                fields={[
                    { name: "assigned_number", label: "الرقم السري" },
                    { name: "to_academic_year", label: "العام الدراسي" },
                ]}
                editable={false}
                deletable={false}
                onClick={(row) => navigate(`/marks/record/${row.id}?round=second`)}
            />
        </Page>
    );
}
