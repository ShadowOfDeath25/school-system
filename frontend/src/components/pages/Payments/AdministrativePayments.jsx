import PaymentsTable from "@ui/PaymentsTable/PaymentsTable.jsx";
import {PaymentHelper} from "@helpers/PaymentHelper.js";
import {useOutletContext} from "react-router";

export default function AdministrativePayments() {
    const {student, academicYear} = useOutletContext()
    return (
        <>
            <PaymentsTable
                student={student}
                academicYear={academicYear}
                type={PaymentHelper.PAYMENT_TYPES.ADMINISTRATIVE}
                btnText={"اضافة حركة مصروفات ادارية"}
            />

        </>
    );
}

