import styles from "./styles.module.css";

const CATEGORY_LABELS = {
    passed: "ناجح",
    دور_ثاني_eligible: "دور ثاني",
    repeat: "راسب (إعادة)",
    graduated: "متخرج",
};

const CATEGORY_PILLS = {
    passed: styles.pillPassed,
    دور_ثاني_eligible: styles.pillSupplementary,
    repeat: styles.pillRepeat,
    graduated: styles.pillGraduated,
};

export default function EligibilityPreview({ students = [] }) {
    return (
        <div>
            <h4 className={styles.sectionTitle}>تفاصيل الطلاب</h4>
            <div className={styles.tableSection}>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>الاسم</th>
                            <th>الصف</th>
                            <th>اللغة</th>
                            <th>القرار</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length === 0 && (
                            <tr>
                                <td colSpan={5} className={styles.emptyState}>
                                    لا يوجد طلاب
                                </td>
                            </tr>
                        )}
                        {students.map((student, idx) => (
                            <tr key={student.id}>
                                <td>{idx + 1}</td>
                                <td>{student.name}</td>
                                <td>{student.grade}</td>
                                <td>{student.language}</td>
                                <td>
                                    <span className={`${styles.pill} ${CATEGORY_PILLS[student.category] || ""}`}>
                                        {CATEGORY_LABELS[student.category] || student.category}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
