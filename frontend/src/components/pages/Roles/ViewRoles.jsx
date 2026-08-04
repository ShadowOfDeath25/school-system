import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import {useGetAll, useUpdate} from "@hooks/api/useCrud.js";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import {useInputModal} from "@contexts/InputModalContext.jsx";
import {useQueryClient} from "@tanstack/react-query";

export default function ViewRoles() {
    const {data: permissions} = useGetAll("permissions");
    const {showInputModal, hideInputModal} = useInputModal();
    const {showSnackbar} = useSnackbar();
    const queryClient = useQueryClient();
    const updateMutation = useUpdate("roles");
    const fields = [
        {
            name: "name",
            label: "اسم الرتبة",
            type: "text",
            required: true,
            placeholder: "اسم الرتبة",

        },
        {
            name: "permissions",
            label: "الصلاحيات",
            type: "permissions",
            required: false,
            options: permissions,
        }
    ]

    const handleEdit = (item) => {
        const allRoles = queryClient
            .getQueriesData({queryKey: ["roles"], type: "active"})
            .flatMap(([, d]) => (Array.isArray(d?.data) ? d?.data : []));
        const originalItem = allRoles.find(d => d.id === item.id) ?? item;
        const rawPermissions = originalItem?.permissions ?? {};
        let selectedPermissions = [];
        if (rawPermissions && typeof rawPermissions === "object" && !Array.isArray(rawPermissions)) {
            for (let [key, value] of Object.entries(rawPermissions)) {
                if (Array.isArray(value)) {
                    value.forEach((action) => {
                        if (permissions?.[key]?.includes(action)) {
                            selectedPermissions.push(`${action} ${key}`);
                        }
                    });
                }
            }
        }

        showInputModal({
            fields: fields,
            item: {...originalItem, permissions: selectedPermissions},
            onSave: (formData) => {
                const payload = {name: formData.name, permissions: formData.permissions ?? []};
                updateMutation.mutate({...payload, id: item.id}, {
                    onSuccess: () => {
                        showSnackbar("تم تحديث العنصر بنجاح");
                        hideInputModal();
                    },
                    onError: (error) => {
                        showSnackbar("حدث خطأ اثناء تحديث العنصر")
                    }
                });
            },
            isLoading: updateMutation.isLoading,
            serverErrors: updateMutation.error?.response?.data?.errors,
        });
    };


    return (
        <Page>

            <Table
                resource={"roles"}
                handleEdit={handleEdit}
            />

        </Page>
    );
}

