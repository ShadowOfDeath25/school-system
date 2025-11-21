import Page from "@ui/Page/Page.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import Table from "@ui/Table/Table.jsx";
import {useState} from "react";
import {ClassroomHelper} from "@helpers/ClassroomHelper.js";

export default function ViewBookPurchases() {
    const [filters, setFilters] = useState();
    return (
        <>
            <Page>
                <Filters
                    resource={'book-purchases'}
                    onSubmit={(filters) => setFilters(filters)}
                    labels={{
                        "book.academic_year": "السنة الدراسية",
                        "book.semester": "الفصل الدراسي",
                        "book.language": "اللغة",
                        "book.type": "النسخة",
                    }}
                    additionalFields={[
                        {
                            ...ClassroomHelper.FIELDS.LEVEL,
                            name: "book.level"
                        },
                        {
                            ...ClassroomHelper.FIELDS.GRADE,
                            name: "book.grade"
                        }
                    ]}
                />
                <Table
                    resource={'book-purchases'}
                    filters={filters}
                    fields={[
                        {
                            name: "type",
                            label: "النسخة"
                        },
                        {
                            name:"level",
                            label:"المرحلة"
                        },
                        {
                            name:"grade",
                            label:"الفرقة"
                        },
                        {
                            name:"quantity",
                            label:"الكمية"
                        },
                        {
                            name:"price",
                            label:"السعر"
                        },
                        {
                            name:"total_price",
                            label:"الاجمالي"
                        },
                        {
                            name:"student_name",
                            label:"اسم الطالب"
                        },

                    ]}
                    editable={false}
                    deletable={false}
                />
            </Page>
        </>
    );
}

