import {useLocation} from "react-router";
import DetailsPage from "@ui/DetailsPage/DetailsPage.jsx";
import {Link, Navigate} from "react-router-dom";
import style from '@ui/Page/style.module.css'
import BookPicker from "@ui/BookPicker/BookPicker.jsx";
import PaymentsTable from "@ui/PaymentsTable/PaymentsTable.jsx";
import {PaymentHelper} from "@helpers/PaymentHelper.js";
import {useState} from "react";
import {getAcademicYears} from "@utils/getAcademicYears.js";

export default function BookPayments() {
    const {state} = useLocation()
    const [academicYear, setAcademicYear] = useState(getAcademicYears()[0]);
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
            academicYear={academicYear}
            setAcademicYear={setAcademicYear}
        >

            <PaymentsTable
                student={state.student}
                type={PaymentHelper.PAYMENT_TYPES.BOOKS}
                academicYear={academicYear}
            />
            <BookPicker
                student={state.student}
            />

        </DetailsPage>
    );
}

