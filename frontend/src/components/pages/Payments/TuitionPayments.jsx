import {useOutletContext} from "react-router";
import PaymentsTable from "@ui/PaymentsTable/PaymentsTable.jsx";
import {PaymentHelper} from "@helpers/PaymentHelper.js";

export default function TuitionPayments() {
    const {student, academicYear} = useOutletContext()
    return (
        <>
            <PaymentsTable
                student={student}
                academicYear={academicYear}
                type={PaymentHelper.PAYMENT_TYPES.TUITION}
                btnText={"اضافة حركة مصروفات دراسية"}
            />
        </>
    );
}

