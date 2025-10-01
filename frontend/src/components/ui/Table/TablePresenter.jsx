import styles from './styles.module.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {get} from 'lodash';
import IconButton from "@mui/material/IconButton";

export default function TablePresenter({
                                           data,
                                           columnKeys,
                                           t,
                                           userCanEdit,
                                           userCanDelete,
                                           onEditClick,
                                           onDeleteClick,
                                           children = [],
                                           fields
                                       }) {
    if (data.length === 0) {
        return (
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                <h3>لا يوجد بيانات للعرض</h3>
            </div>
        );
    }
    const childrenArray = children ? Array.isArray(children) ? children : [children] : [];
    const childHeaders = new Set(childrenArray.map(child => child.header));
    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    {columnKeys.map(key => (key !== "id" &&
                        !childHeaders.has(key) &&
                        <th key={key} className={styles.cell}>
                            {(() => {
                                const field = fields.find(f => f.name === key);
                                return field?.label || field?.header || t(key) || key;
                            })()}
                        </th>
                    ))}
                    {childrenArray.map(child => (
                        <th key={child.header} className={styles.actionCell}>{child.header}</th>))}
                    {userCanEdit && <th className={`${styles.actionCell} ${styles.cell}`}>تعديل</th>}
                    {userCanDelete && <th className={`${styles.actionCell} ${styles.cell}`}>حذف</th>}
                </tr>
            </thead>
            <tbody>
                {data.map((row) => (
                    <tr key={row.id || row.name} className={styles.row}>
                        {columnKeys.map((key) => (
                            key !== 'id' && !childHeaders.has(key) &&
                            <td key={`${row.id}-${key}`} className={styles.cell}>
                                {(() => {
                                    const field = fields.find(f => f.name === key);
                                    return field?.render ? field.render(row) : (Array.isArray(get(row, key)) ? get(row, key).join(', ') : get(row, key));
                                })()}
                            </td>
                        ))}
                        {
                            childrenArray.map((child, index) => {
                                if (typeof child.content === 'function') {
                                    return <td key={`additionalColumn-${index}`} className={styles.actionCell}>
                                        {child.content(row)}
                                    </td>
                                } else {
                                    return <td key={`additionalColumn-${index}`} className={styles.actionCell}>
                                        {child.content}
                                    </td>
                                }
                            })
                        }
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
