import Page from "@ui/Page/Page.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import {useState} from "react";
import Table from "@ui/Table/Table.jsx";
import {validator} from "@hooks/useValidator.js";
import {useGetAll} from "@hooks/api/useCrud.js";

export default function ViewUsers() {
    const {data: roles, isLoading} = useGetAll("roles")
    const normalizedRoles = roles?.data.map((role) => {
        return {value: role?.name, label: role?.name}
    })
    const [filters, setFilters] = useState({});
    const onSubmit = (filters) => {
        setFilters(filters);
    }
    const fields = [
        {
            name: "email",
            placeholder: "البريد الإلكتروني",
            type: "text",
            validator: validator.users.email,
            label: 'البريد الإلكتروني',
            required: true,
            id: 'email',
            error: 'البريد الإلكتروني غير صالح'
        },
        {
            name: "name",
            placeholder: "الاسم",
            type: "text",
            label: 'الاسم',
            required: true,
            id: 'name'
        },
        {
            name: "role",
            type: "select",
            label: "الصلاحيات",
            placeholder: "اختر صلاحية ...",
            id: "role",
            required: true,
            multiple:true,
            error: "الرجاء اختيار صلاحية",
            validator: (value) => value !== "",
            options: normalizedRoles

        }
    ]

    return (
        <>
            <Page title={"عرض المستخدمين"} breadcrumbs={breadcrumbs}>
                <Filters
                    resource={"users"}
                    onSubmit={onSubmit}
                    fields={["roles"]}
                />
                <Table
                    resource={"users"}
                    filters={filters}
                    fields={fields}
                />
            </Page>
        </>
    );
}

