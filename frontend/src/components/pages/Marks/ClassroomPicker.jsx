import { useState } from "react";
import { useNavigate } from "react-router";
import Page from "@ui/Page/Page.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import Table from "@ui/Table/Table.jsx";

export default function MarksIndex() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({});

    return (
        <Page>
            <Filters
                resource={"marks/secret-assignments"}
                onSubmit={(f) => setFilters(f)}
                labels={{ academic_year: "العام الدراسي" }}
            />
            <Table
                resource={"marks/secret-assignments"}
                filters={filters}
                fields={[
                    { name: "assigned_number", label: "الرقم السري" },
                    { name: "academic_year", label: "العام الدراسي" },
                ]}
                editable={false}
                deletable={false}
                onClick={(row) => navigate(`/marks/record/${row.student_id}`, {
                    state: { secret_number: row.assigned_number }
                })}
            />
        </Page>
    );
}
