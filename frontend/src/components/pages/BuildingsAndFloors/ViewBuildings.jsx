import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";

export default function ViewBuildings() {

    return (
        <Page>
            <Table
                resource={'buildings'}
                editable={false}
                fields={[{name: "name"}]}
            >

            </Table>
        </Page>
    );
}

