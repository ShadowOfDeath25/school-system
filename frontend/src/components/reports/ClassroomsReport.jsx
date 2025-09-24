import React, {forwardRef} from "react";
import styles from './ClassroomsReport.module.css';

const ClassroomsReport = forwardRef(({data}, ref) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return (
            <div className={styles.hiddenContainer}>
                <div ref={ref} className={styles.report}>
                    <p>No classroom data provided for the report.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.hiddenContainer}>
            <div ref={ref} className={styles.report}>
                {data.map((classroom, classroomIndex) => (
                    <div
                        key={classroom.id}
                        className={classroomIndex === data.length - 1 ? styles.lastClassroomSection : styles.classroomSection}
                    >
                        <header className={styles.header}>
                            <h1 className={styles.title}>{classroom.name}</h1>
                        </header>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={`${styles.th} ${styles.cellCenter}`}>#</th>
                                    <th className={styles.th}>اسم الطالب</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classroom.students && classroom.students.length > 0 ? (
                                    classroom.students.map((student, index) => (
                                        <tr key={student.id || index}
                                            className={index % 2 !== 0 ? styles.trOdd : styles.trEven}>
                                            <td className={`${styles.td} ${styles.cellCenter}`}>{student.id || (index + 1)}</td>
                                            <td className={styles.td}>{student.name_in_arabic || student.name}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className={`${styles.td} ${styles.noStudents}`}>
                                           لا يوجد طلاب في هذا الفصل
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
});

ClassroomsReport.displayName = 'ClassroomsReport';

export default ClassroomsReport
