import { useState } from "react";
import { useNavigate } from "react-router";
import Page from "@ui/Page/Page.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import Table from "@ui/Table/Table.jsx";

export default function RecordByName() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({});

    return (
        <Page>
            <Filters
                resource={"marks/students-by-name"}
                onSubmit={(f) => setFilters(f)}
                labels={{ grade: "الصف", language: "اللغة" }}
            />
            <Table
                resource={"marks/students-by-name"}
                filters={filters}
                fields={[
                    { name: "name_in_arabic", label: "الاسم" },
                    { name: "secret_number", label: "الرقم السري" },
                    { name: "grade_name", label: "الصف" },
                    { name: "level", label: "المرحلة" },
                    { name: "language", label: "اللغة" },
                ]}
                editable={false}
                deletable={false}
                onClick={(row) => navigate(`/marks/record/${row.id}`, {
                    state: { student_name: row.name_in_arabic }
                })}
            />
        </Page>
    );
}