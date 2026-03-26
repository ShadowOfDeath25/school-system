import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import {useNavigate} from "react-router";

export default function GradePicker() {
    const navigate = useNavigate();
    return (
        <Page>
            <Table
                resource={"grades"}
                searchable={false}
                editable={false}
                deletable={false}
                onClick={(grade) => navigate(`${grade.id}`, {state: {grade: grade}})}
            />
        </Page>
    );
}

