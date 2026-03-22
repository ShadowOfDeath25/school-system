import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";

export default function ActivityLogs() {


    return (
        <Page>
            <Table
                resource={"activity-logs"}
                editable={false}
            />
        </Page>
    );
}

