import Page from "@ui/Page/Page.jsx";
import {Link, useLocation} from "react-router-dom";
import styles from "@ui/Page/style.module.css";

export default function StudentMarks() {
    const {state} = useLocation();

    const breadcrumbsLinks = [
        <Link to={"/students/promote/classrooms"} state={state} className={styles.breadcrumbLink}>رصد الدرجات و ترقية
            الطلاب</Link>,
        <Link to={`/students/promote/classrooms/${state.classroom.id}`} state={state} className={styles.breadcrumbLink}>اختر
            طالب</Link>
    ]
    return (
        <>
            <Page breadcrumbsLinks={breadcrumbsLinks}>

            </Page>
        </>
    );
}

