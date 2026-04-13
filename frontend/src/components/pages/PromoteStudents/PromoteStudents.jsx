import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import {useNavigate} from "react-router";
import Filters from "@ui/Filters/Filters.jsx";
import {useState} from "react";

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
        {
            ...ClassroomHelper.FIELDS.LEVEL,
            name: "classroom.level",
        },
        {
            ...ClassroomHelper.FIELDS.GRADE,
            name: "classroom.grade",
            dependency: "classroom.level",
        },
        {
            ...ClassroomHelper.FIELDS.CLASSROOM,
            options: (values) => {
                let [grade, level] = values;
                if (!grade || !level || !classrooms?.data) return [];
                return [...new Set(classrooms.data.filter(classroom => classroom.grade === grade && classroom.level === level).map(classroom => classroom.name))]
            },

        }

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

