import styles from './styles.module.css';
import {useEffect, useState} from "react";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import {useDelete, useGetAll, useUpdate} from "@hooks/api/useCrud.js";
import {useCurrentUser} from "@hooks/api/auth.js";
import {useModal} from "@contexts/ConfirmModalContext.jsx";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import {useTranslation} from "react-i18next";
import {useEditModal} from "@contexts/EditModalContext.jsx";
import TableToolbar from "./TableToolbar.jsx";
import TablePresenter from "./TablePresenter.jsx";
import TablePagination from "./TablePagination.jsx";

export default function Table({resource, fields = [], filters = null}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    const {data: user, isLoading: userIsLoading} = useCurrentUser();
    const {confirm} = useModal();
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
        page: currentPage, search: debouncedSearchTerm, ...filters
    });

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
            fields: fields,
            item: item,
            onSave: (formData) => {
                updateMutation.mutate({...formData, id: item.id}, {
                    onSuccess: () => {
                        showSnackbar("تم تحديث العنصر بنجاح");
                        hideEditModal();
                    },
                    onError: () => {
                        showSnackbar("حدث خطأ اثناء تحديث العنصر")
                    }
                });
            },
            isLoading: updateMutation.isLoading,
            serverErrors: updateMutation.error?.response?.data?.errors,
        });
    };

    const userCanEdit = user?.role.includes("Super Admin") || user?.permissions.includes(`update ${resource}`);
    const userCanDelete = user?.role.includes("Super Admin") || user?.permissions.includes(`delete ${resource}`);

    if (isLoading || userIsLoading) {
        return (
            <div className={styles.wrapper}>
                <TableToolbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} disabled={true}/>
                <div className={styles.tableContainer}>
                    <LoadingScreen/>
                </div>
            </div>
        );
    }

    if (isError || !data || !data.data) {
        return (
            <div className={styles.wrapper}>
                <TableToolbar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                <div className={styles.tableContainer}
                     style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <h3>{isError ? "حدث خطأ أثناء جلب البيانات" : "لا يوجد بيانات للعرض"}</h3>
                </div>
            </div>
        );
    }

    const fieldNames = fields.map(field => field.name).filter(field => field !== 'password' && field !== 'password_confirmation');
    const columnKeys = fields.length > 0 ? fieldNames : (data.data.length > 0 ? Object.keys(data.data[0]) : []);

    return (
        <div className={styles.wrapper}>
            <TableToolbar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            <div className={styles.tableContainer}>
                <TablePresenter
                    data={data.data}
                    columnKeys={columnKeys}
                    t={t}
                    userCanEdit={userCanEdit}
                    userCanDelete={userCanDelete}
                    onEditClick={handleEditClick}
                    onDeleteClick={handleRowDelete}
                />
            </div>
            <TablePagination links={data.meta.links} onPageChange={handlePageChange}/>
        </div>
    );
}
