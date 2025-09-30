import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import Filters from "@ui/Filters/Filters.jsx";


export default function ViewSubjects() {
    return (
        <>
            <Page>
                <Filters
                    resource={"subjects"}
                />

                <Table
                    resource={"subjects"}

                />
            </Page>
        </>
    );
}

