import styles from './styles.module.css';
import {useState} from "react";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";

export default function Table({query, fields = {}}) {
    const [currentPage, setCurrentPage] = useState(1);

    const {data, isLoading, isError} = query(currentPage);

    const handlePageChange = (link) => {

        if (!link.url || link.active) {
            return;
        }

        const url = new URL(link.url);
        const pageNumber = url.searchParams.get('page');
        setCurrentPage(pageNumber);
    };

    if (isLoading) {
        return <div className={styles.wrapper}><LoadingScreen/></div>
    }

    if (isError) {
        return <div className={styles.wrapper}><h3>حدث خطأ في تحميل البيانات ، الرجاء المحاولة لاحقًا</h3></div>
    }


    if (!data?.data?.length) {
        return <div className={styles.wrapper}><h3>لا يوجد بيانات للعرض</h3></div>
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
    return (<div className={styles.wrapper}>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            {columnKeys.map(key => (<th key={key} className={styles.cell}>{fields[key] || key}</th>))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.data.map((row, rowIndex) => {
                            return <tr key={rowIndex} className={styles.row}>
                                {columnKeys.map((key, cellIndex) => (
                                    <td key={rowIndex + cellIndex} className={styles.cell}>{row[key]}</td>))}
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
