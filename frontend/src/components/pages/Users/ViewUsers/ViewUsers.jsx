import Page from "@ui/Page/Page.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import {useState} from "react";
import Table from "@ui/Table/Table.jsx";
import {validator} from "@hooks/useValidator.js";
import {useGetAll} from "@hooks/api/useCrud.js";

export default function ViewUsers() {
    const breadcrumbs = [
        <span>المستخدمين</span>,
        <span>عرض المستخدمين</span>
    ];
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
            name: "password",
            placeholder: "كلمة المرور",
            type: "password",
            validator: validator.users.password,
            label: 'كلمة المرور',
            required: false,
            id: 'password',
            error: 'كلمة المرور غير صالحه'
        },
        {
            name: "password_confirmation",
            placeholder: 'تأكيد كلمة المرور',
            type: "password",
            label: 'تأكيد كلمة المرور',
            id: 'password_confirmation',
            required: false,
            error: 'كلمتان المرور غير متطابقتان',
            validator: validator.users.confirmPassword,
        },
        {
            name: "roles",
            type: "select",
            label: "الصلاحية",
            placeholder: "اختر صلاحية ...",
            id: "role",
            required: true,
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

