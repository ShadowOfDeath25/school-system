import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import {useNavigate} from "react-router";
import Filters from "@ui/Filters/Filters.jsx";
import {useState} from "react";
import {ClassroomHelper} from "@helpers/ClassroomHelper.js";

export default function PromoteStudents() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({});
    const handleRowClick = (row) => {
        navigate(`${row.id}`, {
            state: {
                classroom: row
            }
        });
    }
    const filterFields = [
        ClassroomHelper.FIELDS.LEVEL,
        ClassroomHelper.FIELDS.GRADE
    ]

    return (
        <Page>
            <Filters
                resource={"classrooms"}
                onSubmit={(filters) => setFilters(filters)}
                fields={filterFields}

            />
            <Table
                filters={filters}
                resource={'classrooms'}
                onClick={handleRowClick}
                editable={false}
                deletable={false}
            />
        </Page>
    );
}

