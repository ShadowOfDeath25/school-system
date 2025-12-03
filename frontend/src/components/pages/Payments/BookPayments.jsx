import {useLocation, useParams} from "react-router";
import DetailsPage from "@ui/DetailsPage/DetailsPage.jsx";
import {Link, Navigate} from "react-router-dom";
import style from '@ui/Page/style.module.css'
import BookPicker from "@ui/BookPicker/BookPicker.jsx";
import PaymentsTable from "@ui/PaymentsTable/PaymentsTable.jsx";
import {PaymentHelper} from "@helpers/PaymentHelper.js";
import {useState} from "react";
import {getAcademicYears} from "@utils/getAcademicYears.js";
import {useGet} from "@hooks/api/useCrud.js";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";

export default function BookPayments() {
    const {state} = useLocation();
    const studentFromState = state?.student;

    const [academicYear, setAcademicYear] = useState(getAcademicYears()[0]);
    const {id} = useParams();

    const {data: fetchedStudent, isLoading} = useGet('students', id, {}, {enabled: !studentFromState});

    const student = studentFromState || fetchedStudent;

    if (isLoading) {
        return (
            <div style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <LoadingScreen/>
            </div>
        );
    }

    if (!student) {
        return <Navigate to={'/payments/books'}/>;
    }

    return (
        <DetailsPage
            student={student}
            breadcrumbsLinks={[
                <Link className={style.breadcrumbLink} to={'/payments'}>مدفوعات التلاميذ</Link>,
                <Link className={style.breadcrumbLink} to={'/payments/books'}>مدفوعات الكتب</Link>
            ]}
            academicYear={academicYear}
            setAcademicYear={setAcademicYear}
        >
            <PaymentsTable
                student={student}
                type={PaymentHelper.PAYMENT_TYPES.BOOKS}
                academicYear={academicYear}
            />
            <BookPicker
                student={student}
                academicYear={academicYear}
            />
        </DetailsPage>
    );
}
