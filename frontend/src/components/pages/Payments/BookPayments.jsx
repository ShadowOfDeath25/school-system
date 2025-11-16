import {useLocation} from "react-router";
import DetailsPage from "@ui/DetailsPage/DetailsPage.jsx";
import {Navigate,Link} from "react-router-dom";
import styles from '@ui/Page/style.module.css'
export default function BookPayments() {
    const {state} = useLocation()

    if (state === null || state.student === null) {
        return <Navigate to={'/payments/books'}/>
    }
    return (
        <DetailsPage
            student={state.student}
            breadcrumbsLinks={
                [
                    <Link className={styles.breadcrumbLink} to={'/payments'}>مدفوعات التلاميذ</Link>,
                    <Link className={styles.breadcrumbLink} to={'/payments/books'}>مدفوعات الكتب</Link>
                ]
            }
        />
    );
}

