import React from "react";
import styles from "@pages/StudentReports/styles.module.css";

export default function ClassroomStatisticsTable({ data }) {
    const { subjects, classrooms, totals_row } = data;

    if (!subjects?.length || !classrooms?.length) {
        return <div className={styles.emptyState}>لا توجد بيانات</div>;
    }

    const thSubRows = [];
    subjects.forEach((s) => {
        thSubRows.push(
                                        <th key={`att-${s.id}`} className={styles.th} style={{ fontSize: 11 }}>حاضر</th>,
            <th key={`suc-${s.id}`} className={styles.th} style={{ fontSize: 11 }}>ناجح</th>,
            <th key={`pct-${s.id}`} className={styles.th} style={{ fontSize: 11 }}>%</th>,
        );
    });

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.th} rowSpan={2} style={{ verticalAlign: "middle" }}>الفصل</th>
                        <th className={styles.th} rowSpan={2} style={{ verticalAlign: "middle" }}>مقيد</th>
                        {subjects.map((s) => (
                            <th key={s.id} className={styles.th} colSpan={3} style={{ textAlign: "center" }}>
                                {s.name}<br /><small>({s.max})</small>
                            </th>
                        ))}
                    </tr>
                    <tr>{thSubRows}</tr>
                </thead>
                <tbody>
                    {classrooms.map((classroom, ci) => {
                        const tdCells = [];
                        classroom.subject_stats.forEach((stat) => {
                            tdCells.push(
                                <td key={`a-${ci}-${stat.subject_id}`} className={styles.td}>{stat.attempted}</td>,
                                <td key={`s-${ci}-${stat.subject_id}`} className={styles.td}>{stat.succeeded}</td>,
                                <td key={`p-${ci}-${stat.subject_id}`} className={styles.td} style={{ fontWeight: "bold" }}>{stat.percentage}%</td>,
                            );
                        });

                        return (
                            <tr key={ci} className={ci % 2 === 0 ? styles.trEven : styles.trOdd}>
                                <td className={styles.td}>{classroom.name}</td>
                                <td className={styles.td}>{classroom.total_students}</td>
                                {tdCells}
                            </tr>
                        );
                    })}
                    {totals_row && (
                        <tr style={{ fontWeight: "bold", background: "rgba(191, 161, 92, 0.15)" }}>
                            <td className={styles.td}>{totals_row.name}</td>
                            <td className={styles.td}>{totals_row.total_students}</td>
                            {totals_row.subject_stats.map((stat, si) => (
                                <React.Fragment key={`t-${si}`}>
                                    <td className={styles.td}>{stat.attempted}</td>
                                    <td className={styles.td}>{stat.succeeded}</td>
                                    <td className={styles.td} style={{ fontWeight: "bold" }}>{stat.percentage}%</td>
                                </React.Fragment>
                            ))}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
