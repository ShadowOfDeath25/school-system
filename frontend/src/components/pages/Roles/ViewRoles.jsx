import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import {useGetAll, useUpdate} from "@hooks/api/useCrud.js";
import {useTranslation} from "react-i18next";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import {useInputModal} from "@contexts/InputModalContext.jsx";
import {useQueryClient} from "@tanstack/react-query";

export default function ViewRoles() {
    const {data: permissions} = useGetAll("permissions");
    const {t} = useTranslation();
    const {showEditModal, hideEditModal} = useInputModal();
    const {showSnackbar} = useSnackbar();
    const queryClient = useQueryClient();
    const data = queryClient.getQueriesData({queryKey: ["roles"], type: "active"})[0]?.[1];
    const updateMutation = useUpdate("roles");
    const fields = [
        {
            name: "name",
            label: "اسم الرتبة",
            type: "text",
            required: true,
            placeholder: "اسم الرتبة",

        }
    ]
    fields.push(...Object.keys(permissions || {})?.map((key) => {
        return {
            name: key,
            label: t(key),
            type: "select",
            multiple: true,
            required: false,
            options: permissions[key]?.map((permission) => ({label: t(permission), value: `${permission} ${key}`})),
            placeholder: "لا صلاحية"
        }
    }));

    const handleEdit = (item) => {
        const originalItem = data?.data?.find(d => d.id === item.id);
        let permissions = {}

        for (let [key, value] of Object.entries(originalItem?.permissions)) {
            permissions[key] = value.map(action => `${action} ${key}`)
        }
        originalItem.permissions = permissions;

        showEditModal({
            fields: fields,
            item: originalItem,
            onSave: (formData) => {
                let payload = {name: formData.name, permissions: []}
                for (let [key, value] of Object.entries(formData)) {
                    if (key !== "name" && value !== "" && typeof value === "object") {
                        payload.permissions.push(...value);
                    }
                }
                updateMutation.mutate({...payload, id: item.id}, {
                    onSuccess: () => {
                        showSnackbar("تم تحديث العنصر بنجاح");
                        hideEditModal();
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

