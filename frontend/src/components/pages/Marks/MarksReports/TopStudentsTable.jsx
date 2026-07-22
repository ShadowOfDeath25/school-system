import styles from "@pages/StudentReports/styles.module.css";

export default function TopStudentsTable({ data }) {
    const { grades } = data;

    if (!grades?.length) {
        return <div className={styles.emptyState}>لا توجد بيانات</div>;
    }

    return (
        <>
            {grades.map((gradeData, gi) => (
                <div key={gi} className={styles.tableWrapper} style={{ marginTop: gi > 0 ? 24 : 0 }}>
                    <h4 style={{ margin: "0 0 8px", fontSize: 14, color: "var(--secondary-color)" }}>
                        {gradeData.grade_name} — المجموع الكلي: {gradeData.max_score}
                    </h4>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th} style={{ width: 50 }}>الرتبة</th>
                                <th className={styles.th}>اسم الطالب</th>
                                <th className={styles.th} style={{ width: 80 }}>رقم الجلوس</th>
                                <th className={styles.th} style={{ width: 100 }}>الفصل</th>
                                <th className={styles.th} style={{ width: 100 }}>المجموع / {gradeData.max_score}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gradeData.students.map((student, si) => (
                                <tr key={si} className={si % 2 === 0 ? styles.trEven : styles.trOdd}>
                                    <td className={styles.td} style={{ fontWeight: "bold" }}>
                                        {student.rank}
                                        {student.is_repeated && <span style={{ color: "#e74c3c", fontSize: 11 }}> (مكرر)</span>}
                                    </td>
                                    <td className={styles.td}>{student.name}</td>
                                    <td className={styles.td}>{student.seat_number ?? "—"}</td>
                                    <td className={styles.td}>{student.classroom_name ?? "—"}</td>
                                    <td className={styles.td} style={{ fontWeight: "bold" }}>{student.total_score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </>
    );
}
