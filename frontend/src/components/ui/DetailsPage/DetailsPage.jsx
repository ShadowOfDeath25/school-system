import Page from "@ui/Page/Page.jsx";
import StudentData from "@ui/StudentData/StudentData.jsx";
import StudentPayments from "@ui/StudentPayements/StudentPayments.jsx";
import {useState} from "react";
import {getAcademicYears} from "@utils/getAcademicYears.js";
import styles from './styles.module.css'

export default function DetailsPage({student, children}) {
    const [academicYear, setAcademicYear] = useState(getAcademicYears()[0]);
    return (<>
        <Page>
            <div className={styles.detailsWrapper}>
                <StudentData
                    student={student}
                    academicYear={academicYear}
                    setAcademicYear={setAcademicYear}
                />
                <StudentPayments
                    student={student}
                    academicYear={academicYear}
                />
            </div>
            {children}
        </Page>
    </>);
}

