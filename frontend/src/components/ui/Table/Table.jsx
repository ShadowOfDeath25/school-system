import styles from './styles.module.css';
import {useEffect, useState} from "react";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import SearchIcon from '@mui/icons-material/Search';
import {useDelete, useGetAll} from "@hooks/api/useCrud.js";
import {useCurrentUser} from "@hooks/api/auth.js";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from "@mui/material/IconButton";
import {useModal} from "@contexts/ModalContext.jsx";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";

export default function Table({resource, fields = {}, filters = null}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    const {data: user, isLoading: userIsLoading} = useCurrentUser();
    const userCanEdit = user.roles.includes("Super Admin") || user.permissions.includes(`update ${resource}`);
    const userCanDelete = user.roles.includes("Super Admin") || user.permissions.includes(`delete ${resource}`);
    const {confirm} = useModal()
    const {showSnackbar} = useSnackbar();
    const deleteMutation = useDelete(resource, {
        onSuccess: () => {
            showSnackbar("تم حذف العنصر بنجاح")
        },
        onError: () => {
            showSnackbar("حدث خطأ أثناء حذف العنصر", "error")
        }
    });
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
        search: debouncedSearchTerm, ...filters
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
        const confirmed = await confirm({title: "تأكيد الحذف", message: "هل أنت متأكد من حذف هذا العنصر؟"})
        if (confirmed) {
            deleteMutation.mutate(id);
        }
    };


    if (isLoading || userIsLoading) {
        return (
            <div className={styles.wrapper}>
                <div className={styles.toolbar}>
                    <div className={styles.searchContainer}>
                        <input type="text" placeholder="بحث..." value={searchTerm} disabled
                               className={styles.searchInput}/>
                        <SearchIcon className={styles.searchIcon}/>
                    </div>
                </div>
                <div className={styles.tableContainer}>
                    <LoadingScreen/>
                </div>
            </div>
        );
    }

    if (isError || !data || !data.data) {
        return (
            <div className={styles.wrapper}>
                <div className={styles.toolbar}>
                    <div className={styles.searchContainer}>
                        <input type="text" placeholder="بحث..." value={searchTerm}
                               onChange={(e) => setSearchTerm(e.target.value)} className={styles.searchInput}/>
                        <SearchIcon className={styles.searchIcon}/>
                    </div>
                </div>
                <div className={styles.tableContainer}
                     style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <h3>{isError ? "حدث خطأ أثناء جلب البيانات" : "لا يوجد بيانات للعرض"}</h3>
                </div>
            </div>
        );
    }


    const columnKeys = Object.keys(fields).length > 0
        ? Object.keys(fields)
        : (data.data.length > 0 ? Object.keys(data.data[0]) : []);

    const buttons = data.meta.links.map((link, index) => {
        const isDisabled = !link.url || link.active;
        return (<button
            key={`${link.label}-${index}`}
            disabled={isDisabled}
            onClick={() => handlePageChange(link)}
            dangerouslySetInnerHTML={{__html: link.label}}
            className={link.active ? styles.active : ""}
        />)
    });

    return (<div className={styles.wrapper}>
        <div className={styles.toolbar}>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="بحث..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
                <SearchIcon className={styles.searchIcon}/>
            </div>
        </div>
        <div className={styles.tableContainer}>
            {data.data.length === 0 ? (
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                    <h3>لا يوجد بيانات للعرض</h3>
                </div>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            {columnKeys.map(key => (
                                <th key={key} className={styles.cell}>{fields[key] || key}</th>))}
                            {userCanEdit && <th className={`${styles.actionCell} ${styles.cell}`}>تعديل</th>}
                            {userCanDelete && <th className={`${styles.actionCell} ${styles.cell}`}>حذف</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {data.data.map((row) => (
                            <tr key={row.id} className={styles.row}>
                                {columnKeys.map((key) => (
                                    <td key={`${row.id}-${key}`}
                                        className={styles.cell}>{Array.isArray(row[key]) ? row[key].join(' ، ') : row[key]}</td>))}
                                {userCanEdit &&
                                    <td className={styles.actionCell}>
                                        <IconButton>
                                            <EditIcon sx={{color: "var(--color-focus)"}}/>
                                        </IconButton>
                                    </td>
                                }
                                {userCanDelete &&
                                    <td className={styles.actionCell}>
                                        <IconButton onClick={() => {
                                            handleRowDelete(row.id)
                                        }}>
                                            <DeleteIcon sx={{color: 'var(--color-danger)'}}/>
                                        </IconButton>
                                    </td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
        <div className={styles.pagination}>
            {buttons}
        </div>
    </div>);
}
