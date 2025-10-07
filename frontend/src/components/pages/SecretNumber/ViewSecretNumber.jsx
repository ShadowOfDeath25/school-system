import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import {useState} from "react";
import Filters from "@ui/Filters/Filters.jsx";
import {ClassroomHelper} from "@helpers/ClassroomHelper.js";
import {SeatNumberHelper} from "@helpers/SeatNumberHelper.js";

export default function ViewSecretNumber() {
    const [filters, setFilters] = useState();
    return (
        <>
            <Page>
                <Filters
                    resource={"secret-numbers"}
                    onSubmit={(filters) => {
                        setFilters(filters)
                    }}
                    additionalFields={[ClassroomHelper.FIELDS.LEVEL, ClassroomHelper.FIELDS.GRADE]}
                />
                <Table
                    resource={"secret-numbers"}
                    filters={filters}

                    fields={
                        [
                            {name: "group_number", label: 'رقم المجموعة', editable: false},
                            {
                                ...ClassroomHelper.FIELDS.MAX_CAPACITY,
                                name: "group_capacity",
                                label: 'طاقة المجموعة'

                            },
                            SeatNumberHelper.FIELDS.STARTS_AT,
                            SeatNumberHelper.FIELDS.ENDS_AT,
                        ]
                    }
                />
            </Page>
        </>
    );
}

