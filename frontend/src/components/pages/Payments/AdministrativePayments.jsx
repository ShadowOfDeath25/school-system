import DetailsPage from "@ui/DetailsPage/DetailsPage.jsx";
import {useLocation, useParams} from "react-router";
import {useState} from "react";
import {getAcademicYears} from "@utils/getAcademicYears.js";
import {useGet} from "@hooks/api/useCrud.js";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import {Link, Navigate} from "react-router-dom";
import style from "@ui/Page/style.module.css";
import PaymentsTable from "@ui/PaymentsTable/PaymentsTable.jsx";
import {PaymentHelper} from "@helpers/PaymentHelper.js";

export default function AdministrativePayments() {
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
        <>
            <DetailsPage
                student={student}
                academicYear={academicYear}
                setAcademicYear={setAcademicYear}
                breadcrumbsLinks={[
                    <Link className={style.breadcrumbLink} to={'/payments'}>مدفوعات التلاميذ</Link>,
                    <Link className={style.breadcrumbLink} to={'/payments/administrative'}>المصروفات الادارية</Link>
                ]}
            >
                <PaymentsTable
                    student={student}
                    academicYear={academicYear}
                    type={PaymentHelper.PAYMENT_TYPES.ADMINISTRATIVE}
                    btnText={"اضافة حركة مصروفات ادارية"}
                />
            </DetailsPage>
        </>
    );
}

