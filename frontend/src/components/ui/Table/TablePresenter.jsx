import styles from './styles.module.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton";

export default function TablePresenter({
                                           data,
                                           columnKeys,
                                           t,
                                           userCanEdit,
                                           userCanDelete,
                                           onEditClick,
                                           onDeleteClick
                                       }) {
    if (data.length === 0) {
        return (
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                <h3>لا يوجد بيانات للعرض</h3>
            </div>
        );
    }

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    {columnKeys.map(key => (<th key={key} className={styles.cell}>{t(key) || key}</th>))}
                    {userCanEdit && <th className={`${styles.actionCell} ${styles.cell}`}>تعديل</th>}
                    {userCanDelete && <th className={`${styles.actionCell} ${styles.cell}`}>حذف</th>}
                </tr>
            </thead>
            <tbody>
                {data.map((row) => (
                    <tr key={row.id} className={styles.row}>
                        {columnKeys.map((key) => (
                            <td key={`${row.id}-${key}`} className={styles.cell}>
                                {Array.isArray(row[key]) ? row[key].join(" ، ") : row[key]}
                            </td>
                        ))}
                        {userCanEdit && row.name !== "Super Admin" &&
                            <td className={styles.actionCell}>
                                <IconButton onClick={() => onEditClick(row)}>
                                    <EditIcon sx={{color: "var(--color-focus)"}}/>
                                </IconButton>
                            </td>
                        }
                        {userCanDelete && row.name !== "Super Admin" &&
                            <td className={styles.actionCell}>
                                <IconButton onClick={() => onDeleteClick(row.id)}>
                                    <DeleteIcon sx={{color: 'var(--color-danger)'}}/>
                                </IconButton>
                            </td>
                        }
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
