import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import {useNavigate} from "react-router";
import Filters from "@ui/Filters/Filters.jsx";
import {useState} from "react";
import {ClassroomHelper} from "@helpers/ClassroomHelper.js";
import {useGet, useGetAll} from "@hooks/api/useCrud.js";

export default function ClassroomPicker() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({});
    const {data:academicYears} = useGetAll("academic-years");
    const handleRowClick = (row) => {
        navigate(`classrooms/${row.id}`, {
            state: {classroom: row}
        });
    };

    return (
        <Page>
            <Filters
                resource={"classrooms"}
                onSubmit={(filters) => setFilters(filters)}
                fields={[
                    {
                        ...ClassroomHelper.FIELDS.ACADEMIC_YEAR,
                        options: academicYears?.data?.map((year) => ({ value: year.name, label: year.name }))
                    },
                    ClassroomHelper.FIELDS.LANGUAGE,
                    ClassroomHelper.FIELDS.LEVEL,
                    ClassroomHelper.FIELDS.GRADE,
                ]}
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
