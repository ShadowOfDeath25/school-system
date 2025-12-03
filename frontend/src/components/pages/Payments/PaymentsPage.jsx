import Page from "@ui/Page/Page.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import {useState} from "react";
import Table from "@ui/Table/Table.jsx";
import {useNavigate} from "react-router";
import {ClassroomHelper} from "@helpers/ClassroomHelper.js";
import {useGetAll} from "@hooks/api/useCrud.js";

export default function PaymentsPage({route = ""}) {
    const [filters, setFilters] = useState();
    const navigate = useNavigate()
    const {data: classrooms} = useGetAll("classrooms", {all: "true"});
    const fields = [
        {
            name: "reg_number",
            label: "رقم القيد"
        },
        {
            name: 'name_in_arabic',
            label: 'الاسم'
        },
        {
            name: 'nid',
            label: 'الرقم القومي'
        },
        {
            name: 'status',
            label: 'حالة القيد'
        },
        {
            name: "classroom.name",
            label: "الفصل"
        },
        {
            name: "language",
            label: "اللغة"
        }
    ]


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
        <>
            <Page>
                <Filters
                    resource={"students"}
                    onSubmit={(filters) => setFilters(filters)}
                    fields={filterFields}
                />
                <Table
                    resource={"students"}
                    filters={filters}
                    fields={fields}
                    editable={false}
                    deletable={false}
                    searchable={true}
                    onClick={(student) => {
                        const newRoute = route.replace(":id", student.id);
                        navigate(newRoute, {state: {student: student}})
                    }}
                />
            </Page>
        </>
    );
}

