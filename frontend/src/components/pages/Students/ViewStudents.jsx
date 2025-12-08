import Page from "@ui/Page/Page.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import {useState} from "react";
import Table from "@ui/Table/Table.jsx";
import {ClassroomHelper} from "@utils/helpers/ClassroomHelper.js";
import {StudentHelper} from "@utils/helpers/StudentHelper.js";
import WithdrawButton from "@ui/WithdrawButton/WithdrawButton.jsx";

export default function ViewStudents() {
    const [tableFilters, setTableFilters] = useState(null);
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

    const withdrawButton = {
        header: "سحب الملف", content: <WithdrawButton/>
    }
    return (
        <Page>
            <Filters
                resource={"students"}
                onSubmit={(filter) => setTableFilters(filter)}
                fields={filterFields}
            />
            <Table
                resource={"students"}
                filters={tableFilters}
                fields={fields}
                editFields={StudentHelper.getAllFields()}
            >
                {withdrawButton}
            </Table>
        </Page>
    );
}
