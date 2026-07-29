import Page from "@ui/Page/Page.jsx";
import StudentData from "@ui/StudentData/StudentData.jsx";
import StudentPayments from "@ui/StudentPayments/StudentPayments.jsx";
import ParentPayments from "@ui/ParentPayments/ParentPayments.jsx";
import styles from './styles.module.css'

export default function DetailsPage({student, children, breadcrumbsLinks, academicYear, setAcademicYear}) {
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
                <ParentPayments
                    student={student}
                    academicYear={academicYear}
                />
            </div>


        </Page>
    </>);
}

