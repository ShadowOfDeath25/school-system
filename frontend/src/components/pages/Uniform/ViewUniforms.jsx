import {useState} from "react";
import Page from "@ui/Page/Page.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import Table from "@ui/Table/Table.jsx";
import {UniformHelper} from "@helpers/UniformHelper.js";
import {ClassroomHelper} from "@helpers/ClassroomHelper.js";

export default function ViewUniforms() {
    const [filters, setFilters] = useState();
    return (
        <>
            <Page>
                <Filters
                    resource={'uniforms'}
                    onSubmit={(filters) => setFilters(filters)}
                />
                <Table
                    resource={"uniforms"}
                    editFields={[
                        UniformHelper.FIELDS.SELL_PRICE,
                        UniformHelper.FIELDS.BUY_PRICE,
                        UniformHelper.FIELDS.IMPORTED_QUANTITY,
                        ClassroomHelper.FIELDS.GRADE
                    ]}
                    filters={filters}
                    deletable={false}
                />
            </Page>
        </>
    );
}

