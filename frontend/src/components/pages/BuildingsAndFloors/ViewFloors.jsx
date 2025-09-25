import Page from "@ui/Page/Page.jsx";
import Table from '@ui/Table/Table.jsx'

export default function ViewFloors() {
    return (
        <>
            <Page>
                <Table
                    resource={"floors"}
                    editable={false}
                />
            </Page>
        </>
    );
}

