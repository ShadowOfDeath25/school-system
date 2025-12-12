import {PaymentHelper} from "@helpers/PaymentHelper.js";
import PaymentsTable from "@ui/PaymentsTable/PaymentsTable.jsx";
import {useOutletContext} from "react-router";
import Table from "@ui/Table/Table.jsx";

export default function ExtraDues() {
    const {student, academicYear} = useOutletContext()
    return (
        <>

            <PaymentsTable
                student={student}
                academicYear={academicYear}
                type={PaymentHelper.PAYMENT_TYPES.TUITION}
                btnText={"اضافة حركة مستحقات اضافية"}
            />
        </>
    );
}

