import Table from "@ui/Table/Table.jsx";
import Page from "@ui/Page/Page.jsx";

export default function SubjectTypes() {


    return (

        <Page>
            <Table
                resource={"subjects"}
                params={{types:"null"}}
                editable={false}
                deletable={false}
            />
        </Page>

    );
}

