import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";

export default function Exemptions() {
    return (
        <>
            <Page>
                <Table
                    resource={'exemptions'}
                    params={{globalOnly: 1}}
                    deletable={false}
                    fields={[
                        {name: "type", editable: false},
                        {
                            name: "value",
                            type: "number",
                            min: 0,
                            label: "القيمة",
                            placeholder: "القيمة",
                        }
                    ]}
                />
            </Page>
        </>
    );
}

