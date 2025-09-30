import styles from './styles.module.css';
import {useEffect, useMemo, useState} from "react";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import {useDelete, useGetAll, useUpdate} from "@hooks/api/useCrud.js";
import {useCurrentUser} from "@hooks/api/auth.js";
import {useConfirmModal} from "@contexts/ConfirmModalContext.jsx";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import {useTranslation} from "react-i18next";
import {useEditModal} from "@contexts/EditModalContext.jsx";
import TableToolbar from "./TableToolbar.jsx";
import TablePresenter from "./TablePresenter.jsx";
import TablePagination from "./TablePagination.jsx";

export default function Table({
                                  resource,
                                  fields = [],
                                  filters = null,
                                  editFields = fields,
                                  handleEdit,
                                  editable = true,
                                  params = {},
                                  children
                              }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    const {data: user, isLoading: userIsLoading} = useCurrentUser();
    const {confirm} = useConfirmModal();
    const {showSnackbar} = useSnackbar();
    const {t} = useTranslation();
    const {showEditModal, hideEditModal} = useEditModal();

    const updateMutation = useUpdate(resource);

    const deleteMutation = useDelete(resource);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    const {data, isLoading, isError} = useGetAll(resource, {
        page: currentPage,
        search: debouncedSearchTerm,
        ...filters,
        ...params
    });

    const tableData = useMemo(() => {
        if (!data?.data) return [];

        if (resource !== "roles") {
            return data.data;
        }

        return data.data.map(role => {
            if (role.permissions && typeof role.permissions === 'object' && !Array.isArray(role.permissions)) {
                if (role.permissions.all?.includes('all')) {
                    return {...role, permissions: [t('all_permissions', 'All Permissions')]};
                }

                const translatedPermissions = Object.entries(role.permissions).flatMap(([resourceName, actions]) => actions.map(action => t("permission", {
                    action: t(action), resource: t(resourceName)
                })));
                return {...role, permissions: translatedPermissions};
            }
            return role;
        });
    }, [resource, t, data?.data]);

    const handlePageChange = (link) => {
        if (!link.url || link.active) {
            return;
        }

        const url = new URL(link.url);
        const pageNumber = url.searchParams.get('page');
        setCurrentPage(pageNumber);
    };

    const handleRowDelete = async (id) => {
        const confirmed = await confirm({message: "هل أنت متأكد من حذف هذا العنصر؟"})
        if (confirmed) {
            deleteMutation.mutate(id, {
                onSuccess: () => {
                    showSnackbar("تم حذف العنصر بنجاح")
                }, onError: () => {
                    showSnackbar("حدث خطأ أثناء حذف العنصر", "error")
                }
            });
        }
    };

    const handleEditClick = (item) => {

        showEditModal({
            fields: editFields, item: item, onSave: (formData) => {
                updateMutation.mutate({...formData, id: item.id}, {
                    onSuccess: () => {
                        showSnackbar("تم تحديث العنصر بنجاح");
                        hideEditModal();
                    }, onError: () => {
                        showSnackbar("حدث خطأ اثناء تحديث العنصر", "error")
                    }
                });
            }, isLoading: updateMutation.isLoading, serverErrors: updateMutation.error?.response?.data?.errors,
        });
    };


    const userCanEdit = editable && user?.role.includes("Super Admin") || user?.permissions.includes(`update ${resource}`);
    const userCanDelete = user?.role.includes("Super Admin") || user?.permissions.includes(`delete ${resource}`);

    if (isLoading || userIsLoading) {
        return (<div className={styles.wrapper}>
            <TableToolbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} disabled={true}/>
            <div className={styles.tableContainer}>
                <LoadingScreen/>
            </div>
        </div>);
    }

    if (isError || !data || tableData.length === 0) {
        return (<div className={styles.wrapper}>
            <TableToolbar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            <div className={styles.tableContainer}
                 style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <h3 className={"serverError"}>{isError ? "حدث خطأ أثناء جلب البيانات" : "لا يوجد بيانات للعرض"}</h3>
            </div>
        </div>);
    }

    const fieldNames = fields.map(field => field.name).filter(field => field !== 'password' && field !== 'password_confirmation');
    let columnKeys = fields.length > 0 ? fieldNames : (tableData.length > 0 ? Object.keys(tableData[0]) : []);

    if (children) {
        const childrenArray = Array.isArray(children) ? children : [children];
        columnKeys = [...columnKeys, ...childrenArray.map(child => child.header)];
    }

    return (
        <div className={styles.wrapper}>
            <TableToolbar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            <div className={styles.tableContainer}>
                <TablePresenter
                    data={tableData}
                    columnKeys={columnKeys}
                    t={t}
                    userCanEdit={userCanEdit}
                    userCanDelete={userCanDelete}
                    onEditClick={handleEdit ?? handleEditClick}
                    fields={fields}
                    onDeleteClick={handleRowDelete}
                >
                    {children}
                </TablePresenter>
            </div>
            <TablePagination links={data.meta.links} onPageChange={handlePageChange}/>
        </div>
    );
}
