import Page from "@ui/Page/Page.jsx";

export default function ViewUsers() {
    const breadcrumbs = [
        <span>المستخدمين</span>,
        <span>عرض المستخدمين</span>
    ]
    return (
        <>
            <Page title={"عرض المستخدمين"} breadcrumbs={breadcrumbs}>

            </Page>
        </>
    );
}

