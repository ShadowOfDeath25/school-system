import Button from "@mui/material/Button";
import styles from "./styles.module.css";

export default function StudentMarksTable({ data, detailed, onPrintCertificate }) {
    const { subjects, students } = data;

    if (!subjects?.length) {
        return <div className={styles.emptyState}>لا توجد بيانات</div>;
    }

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    {detailed && subjects[0]?.components ? (
                        <>
                            <tr>
                                <th className={styles.th} rowSpan={2} style={{ verticalAlign: "middle" }}>الطالب</th>
                                <th className={styles.th} rowSpan={2} style={{ verticalAlign: "middle" }}>رقم الجلوس</th>
                                <th className={styles.th} rowSpan={2} style={{ verticalAlign: "middle" }}>الفصل الدراسي</th>
                                {subjects.map((s, i) => (
                                    <th key={i} className={styles.th} colSpan={s.components.length}>
                                        {s.name}<br /><small>({s.max})</small>
                                    </th>
                                ))}
                                {onPrintCertificate && (
                                    <th className={styles.th} rowSpan={2} style={{ verticalAlign: "middle", width: 60 }}>شهادة</th>
                                )}
                            </tr>
                            <tr>
                                {subjects.map((s) =>
                                    s.components.map((c, ci) => (
                                        <th key={`${s.id}-${ci}`} className={styles.th}>
                                            {c.name}<br /><small>({c.marks})</small>
                                        </th>
                                    ))
                                )}
                            </tr>
                        </>
                    ) : (
                        <tr>
                            <th className={styles.th} rowSpan={2} style={{ verticalAlign: "middle" }}>الطالب</th>
                            <th className={styles.th} rowSpan={2} style={{ verticalAlign: "middle" }}>رقم الجلوس</th>
                            {subjects.map((s, i) => (
                                <th key={i} className={styles.th}>
                                    {s.name}<br /><small>({s.max})</small>
                                </th>
                            ))}
                            {onPrintCertificate && (
                                <th className={styles.th} rowSpan={2} style={{ verticalAlign: "middle", width: 60 }}>شهادة</th>
                            )}
                        </tr>
                    )}
                </thead>
                <tbody>
                    {students.map((student, si) => (
                        <tr key={si} className={si % 2 === 0 ? styles.trEven : styles.trOdd}>
                            <td className={styles.td}>{student.name}</td>
                            <td className={styles.td}>{student.seat_number ?? "—"}</td>
                            {detailed && <td className={styles.td}>{student.classroom_name ?? "—"}</td>}
                            {student.marks.map((m, mi) => (
                                <td
                                    key={mi}
                                    className={styles.td}
                                    style={{ color: m.color, fontWeight: "bold" }}
                                >
                                    {m.display}
                                </td>
                            ))}
                            {onPrintCertificate && (
                                <td className={styles.td} style={{ textAlign: "center" }}>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => onPrintCertificate(student.id)}
                                    >
                                        عرض الشهادة
                                    </Button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
