import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import Filters from "@ui/Filters/Filters.jsx";

export default function ViewUsers() {
    const breadcrumbs = [
        <span>المستخدمين</span>,
        <span>عرض المستخدمين</span>
    ]
    const fields = [
        {
            name: "test",
            label: "test",
            placeholder: "test",
            options: [
                {label: "test1", value: "test"},
                {label: "test2", value: "test"},
                {label: "test3", value: "test"}
            ],
            id: "1"
        },
        {
            name: "test",
            label: "test",
            placeholder: "test",
            options: [
                {label: "test1", value: "test"},
                {label: "test2", value: "test"},
                {label: "test3", value: "test"}
            ],
            id: "2"
        },
        {
            name: "test",
            label: "test",
            placeholder: "test",
            options: [
                {label: "test1", value: "test"},
                {label: "test2", value: "test"},
                {label: "test3", value: "test"}
            ],
            id: "2"
        }
    ]
    return (
        <>
            <Page title={"عرض المستخدمين"} breadcrumbs={breadcrumbs}>
                <Filters fields={fields}/>
                <Table resource={"users"} fields={{name: "الاسم", email: "البريد الالكتروني", roles: "الصلاحيات"}}/>
            </Page>
        </>
    );
}

