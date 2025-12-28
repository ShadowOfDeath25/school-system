import Page from "@ui/Page/Page.jsx";
import StudentData from "@ui/StudentData/StudentData.jsx";
import StudentPayments from "@ui/StudentPayements/StudentPayments.jsx";
import styles from './styles.module.css'

export default function DetailsPage({student, children, breadcrumbsLinks, academicYear, setAcademicYear}) {
    console.log(student)
    return (<>
        <Page breadcrumbsLinks={breadcrumbsLinks}>
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
                {children}
            </div>


        </Page>
    </>);
}

