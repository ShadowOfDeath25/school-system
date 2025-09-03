import styles from './styles.module.css';
import {useEffect, useState} from "react";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import SearchIcon from '@mui/icons-material/Search';
import {useGetAll} from "@hooks/api/useCrud.js";
import {useCurrentUser} from "@hooks/api/auth.js";

export default function Table({resource, fields = {}}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    const {data: user, isLoading: userIsLoading} = useCurrentUser();
    const userCanEdit = user.permissions.includes(`update ${resource}`) || user.roles.includes("Super Admin");
    const userCanDelete = user.permissions.includes(`delete ${resource}`) || user.roles.includes("Super Admin");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    const {data, isLoading, isError} = useGetAll(resource, {page: currentPage, search: debouncedSearchTerm});

    const handlePageChange = (link) => {

        if (!link.url || link.active) {
            return;
        }

        const url = new URL(link.url);
        const pageNumber = url.searchParams.get('page');
        setCurrentPage(pageNumber);
    };

    if (isLoading || userIsLoading) {
        return <div className={styles.wrapper}><LoadingScreen/></div>
    }

    if (isError) {
        return <div className={styles.wrapper}><h3>حدث خطأ في تحميل البيانات ، الرجاء المحاولة لاحقًا</h3></div>
    }


    const columnKeys = Object.keys(fields).length > 0 ? Object.keys(fields) : Object.keys(data.data[0]);

    const buttons = data.meta.links.map((link, index) => {
        const isDisabled = !link.url || link.active;
        return (<button
            key={`${link.label}-${index}`}
            disabled={isDisabled}
            onClick={() => handlePageChange(link)}
            dangerouslySetInnerHTML={{__html: link.label}}
            className={link.active ? styles.active : ""}
        />)
    })
    // Todo: Handle editing and deleting resources
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
            <table className={styles.table}>
                <thead>
                    <tr>
                        {columnKeys.map(key => (<th key={key} className={styles.cell}>{fields[key] || key}</th>))}
                        {userCanEdit && <th>تعديل</th>}
                        {userCanDelete && <th>حذف</th>}

                    </tr>
                </thead>
                <tbody>
                    {data.data.map((row, rowIndex) => {

                        return <tr key={rowIndex} className={styles.row}>
                            {columnKeys.map((key, cellIndex) => (
                                <td key={`${rowIndex}-${cellIndex}`}
                                    className={styles.cell}>{Array.isArray(row[key]) ? row[key].join(' ، ') : row[key]}</td>))}
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
        <div className={styles.pagination}>
            {buttons}
        </div>
    </div>);
}
