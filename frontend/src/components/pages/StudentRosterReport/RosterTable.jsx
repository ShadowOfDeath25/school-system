import { useState } from "react";
import styles from "./styles.module.css";

const SORTABLE_COLUMNS = [
    { key: "name_in_arabic", label: "الاسم" },
    { key: "birth_date", label: "تاريخ الميلاد" },
    { key: "status", label: "الحالة" },
    { key: "gender", label: "النوع" },
    { key: "religion", label: "الديانة" },
];

export default function RosterTable({ data, sortBy, sortDir, onSort }) {
    if (!data || data.length === 0) {
        return (
            <div className={styles.emptyState}>
                لا توجد بيانات للعرض
            </div>
        );
    }

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.th}>م</th>
                        <th className={styles.th}>رقم القيد</th>
                        {SORTABLE_COLUMNS.map((col) => (
                            <th
                                key={col.key}
                                className={`${styles.th} ${styles.sortable}`}
                                onClick={() => onSort(col.key)}
                            >
                                {col.label}
                                {sortBy === col.key && (
                                    <span className={styles.sortIcon}>
                                        {sortDir === "asc" ? " ▲" : " ▼"}
                                    </span>
                                )}
                            </th>
                        ))}
                        <th className={styles.th}>السن في اول اكتوبر</th>
                        <th className={styles.th}>تاريخ الدخول</th>
                        <th className={styles.th}>الفصل</th>
                        <th className={styles.th}>ولى الامر</th>
                        <th className={styles.th}>التليفون</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((student, index) => (
                        <tr key={student.id} className={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                            <td className={styles.td}>{index + 1}</td>
                            <td className={styles.td}>{student.reg_number || "—"}</td>
                            <td className={styles.td}>{student.name_in_arabic}</td>
                            <td className={styles.td}>{student.birth_date_display}</td>
                            <td className={styles.td}>
                                <span className={`${styles.badge} ${student.status === 'مستجد' ? styles.badgeNew : styles.badgeRegistered}`}>
                                    {student.status}
                                </span>
                            </td>
                            <td className={styles.td}>{student.gender === 'male' ? 'ذكر' : 'انثى'}</td>
                            <td className={styles.td}>{student.religion}</td>
                            <td className={styles.td}>{student.age_display}</td>
                            <td className={styles.td}>{student.entry_date || "—"}</td>
                            <td className={styles.td}>{student.classroom_name || "—"}</td>
                            <td className={styles.td}>{student.guardian_name || "—"}</td>
                            <td className={styles.td}>{student.guardian_phone || "—"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
