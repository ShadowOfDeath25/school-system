import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import {useUsers} from "@hooks/api/users.js";

export default function ViewUsers() {
    const breadcrumbs = [
        <span>المستخدمين</span>,
        <span>عرض المستخدمين</span>
    ]
    return (
        <>
            <Page title={"عرض المستخدمين"} breadcrumbs={breadcrumbs}>
                <Table query={useUsers} fields={{name: "الاسم", email: "البريد الالكتروني", roles: "الصلاحيات"}}/>
            </Page>
        </>
    );
}

