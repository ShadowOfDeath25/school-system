import styles from "./styles.module.css";

export default function StudentMarksTable({ data }) {
    const { subjects, students } = data;

    if (!subjects?.length) {
        return <div className={styles.emptyState}>لا توجد بيانات</div>;
    }

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.th} rowSpan={2} style={{ verticalAlign: "middle" }}>الطالب</th>
                        <th className={styles.th} rowSpan={2} style={{ verticalAlign: "middle" }}>رقم الجلوس</th>
                        {subjects.map((s, i) => (
                            <th key={i} className={styles.th}>
                                {s.name}<br /><small>({s.max})</small>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, si) => (
                        <tr key={si} className={si % 2 === 0 ? styles.trEven : styles.trOdd}>
                            <td className={styles.td}>{student.name}</td>
                            <td className={styles.td}>{student.seat_number ?? "—"}</td>
                            {student.marks.map((m, mi) => (
                                <td
                                    key={mi}
                                    className={styles.td}
                                    style={{ color: m.color, fontWeight: "bold" }}
                                >
                                    {m.display}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
