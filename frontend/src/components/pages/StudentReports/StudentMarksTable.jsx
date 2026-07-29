import Button from "@mui/material/Button";
import styles from "./styles.module.css";

export default function StudentMarksTable({ data, detailed, colorMode = "colors", onPrintCertificate }) {
    const { subjects, students } = data;
    const showColorNames = colorMode === "color_names";

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
                                    <th key={i} className={styles.th} colSpan={s.components.length * (showColorNames ? 2 : 1)}>
                                        {s.name}<br /><small>({s.max})</small>
                                    </th>
                                ))}
                                {onPrintCertificate && (
                                    <th className={styles.th} rowSpan={2} style={{ verticalAlign: "middle", width: 60 }}>شهادة</th>
                                )}
                            </tr>
                            <tr>
                                {subjects.map((s) =>
                                    s.components.flatMap((c, ci) => [
                                        <th key={`${s.id}-${ci}-mark`} className={styles.th}>
                                            {c.name}<br /><small>({c.marks})</small>
                                        </th>,
                                        ...(showColorNames ? [
                                            <th key={`${s.id}-${ci}-color`} className={styles.th}>اللون</th>,
                                        ] : []),
                                    ])
                                )}
                            </tr>
                        </>
                    ) : (
                        <tr>
                            <th className={styles.th} rowSpan={2} style={{ verticalAlign: "middle" }}>الطالب</th>
                            <th className={styles.th} rowSpan={2} style={{ verticalAlign: "middle" }}>رقم الجلوس</th>
                            <th className={styles.th} rowSpan={2} style={{ verticalAlign: "middle" }}>الفصل الدراسي</th>
                            {subjects.map((s, i) => (
                                showColorNames ? (
                                    <th key={i} className={styles.th} colSpan={2}>
                                        {s.name}<br /><small>({s.max})</small>
                                    </th>
                                ) : (
                                    <th key={i} className={styles.th}>
                                        {s.name}<br /><small>({s.max})</small>
                                    </th>
                                )
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
                            {student.marks.flatMap((m, mi) => [
                                <td
                                    key={`${mi}-mark`}
                                    className={styles.td}
                                    style={showColorNames ? { fontWeight: "bold" } : {
                                        backgroundColor: m.color,
                                        color: "#000",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {m.display}
                                </td>,
                                ...(showColorNames ? [
                                    <td key={`${mi}-color`} className={styles.td} style={{ fontWeight: "bold" }}>
                                        {m.color_name}
                                    </td>,
                                ] : []),
                            ])}
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
