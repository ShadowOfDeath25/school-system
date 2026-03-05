import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import {useState} from "react";
import {ClassroomHelper} from "@utils/helpers/ClassroomHelper.js";


export default function ViewSubjects() {
    const [filters, setFilters] = useState({});


    return (
        <>
            <Page>
                <Filters
                    resource={"subjects"}
                    onSubmit={(filters) => setFilters(filters)}
                />

                <Table
                    resource={"subjects"}
                    fields={[
                        {name: "name", editable: false},
                        {name: "language", editable: false},
                        {name: "type", editable: false},
                    ]}
                    filters={filters}
                    editable={false}
                />
            </Page>
        </>
    );
}
