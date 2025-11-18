import {useLocation} from "react-router";
import DetailsPage from "@ui/DetailsPage/DetailsPage.jsx";
import {Link, Navigate} from "react-router-dom";
import style from '@ui/Page/style.module.css'
import styles from './styles.module.css';
import BookPicker from "@ui/BookPicker/BookPicker.jsx";

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
                    <Link className={style.breadcrumbLink} to={'/payments'}>مدفوعات التلاميذ</Link>,
                    <Link className={style.breadcrumbLink} to={'/payments/books'}>مدفوعات الكتب</Link>
                ]
            }
        >
            <div className={styles.container}>

                <BookPicker
                    student={state.student}
                />
            </div>
        </DetailsPage>
    );
}

