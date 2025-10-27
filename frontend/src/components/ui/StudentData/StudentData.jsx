import styles from './styles.module.css'

export default function StudentData({student}) {
    console.log(student)
    return (
        <>
            <div className={styles.container}>
                <h4 className={styles.title}>بيانات التلميذ</h4>
                <table>
                    <tbody>
                        <tr>
                            <td className={styles.label}>الاسم</td>
                            <td colSpan={3}>{student.name_in_arabic}</td>
                        </tr>
                        <tr>
                            <td className={styles.label}>رقم القيد</td>
                            <td>{student.id}</td>
                            <td className={styles.label}>تاريخ الانضمام</td>
                            <td>{student.joined_at}</td>

                        </tr>
                        <tr>
                            <td className={styles.label}>العام الدراسي</td>
                            <td>{student.academic_year}</td>
                            <td className={styles.label}>اللغة</td>
                            <td>{student.language}</td>
                        </tr>
                        <tr>
                            <td className={styles.label}>المرحلة</td>
                            <td>{student.classroom.level}</td>
                            <td className={styles.label}>الصف</td>
                            <td>{student.classroom.grade}</td>
                        </tr>
                        <tr>
                            <td className={styles.label}>الفصل المدرسي</td>
                            <td>{student.classroom.name.slice(0, 4)}</td>
                            <td className={styles.label}>حالة القيد</td>
                            <td>{student.status}</td>
                        </tr>
                        <tr>
                            <td className={styles.label}>اشقاء</td>
                            <td>{student.has_siblings}</td>
                            <td className={styles.label}>علامة مميزة</td>
                            <td>{student.note}</td>
                        </tr>

                    </tbody>
                </table>
            </div>

        </>
    );
}

