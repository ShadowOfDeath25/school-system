import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import {useState} from "react";

const gradeOptionsByLevel = {
    "رياض اطفال": [
        {label: "الأول", value: 1},
        {label: "الثاني", value: 2},
    ],
    "ابتدائي": [
        {label: "الاول", value: 1},
        {label: "الثاني", value: 2},
        {label: "الثالث", value: 3},
        {label: "الرابع", value: 4},
        {label: "الخامس", value: 5},
        {label: "السادس", value: 6},
    ],
    "اعدادي": [
        {label: "الأول", value: 1},
        {label: "الثاني", value: 2},
        {label: "الثالث", value: 3},
    ],
};
export default function ViewClassrooms() {
    const [filters, setFilters] = useState({});
    const filterFields = [
        {
            name: "grade",
            type: 'select',
            multiple:true,
            options: (level) => gradeOptionsByLevel[level] || [],
            dependency: "level",
            label: 'الصف',
            placeholder: 'اختر الصف'

        }
    ]
    const fields = [
        {
            name: "name"
        },
        {
            name: "academic_year"
        },
        {
            name: "language"
        },
        {
            name: "max_capacity"
        },
        {
            name: "capacity",
        },
        {
            name: "occupancy"
        },
    ]
    const editFields = [
        {
            name: 'max_capacity',
            label: "الطاقة الإستيعابية",
            type: "number",
            placeholder:"الطاقة الإستيعابية"
        },
        {
            name: "language",
            type: "radio",
            options: ['لغات', 'عربي'],
            label: 'اللغة'
        }
    ]


    return (
        <>
            <Page>
                <Filters
                    resource={"classrooms"}
                    onSubmit={(filter) => setFilters(filter)}
                    fields={filterFields}
                />
                <Table
                    resource={"classrooms"}
                    filters={filters}
                    fields={fields}
                    editFields={editFields}
                />


            </Page>
        </>
    );
}
