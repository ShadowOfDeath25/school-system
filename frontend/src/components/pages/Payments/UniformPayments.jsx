import PaymentsTable from "@ui/PaymentsTable/PaymentsTable.jsx";
import {useOutletContext} from "react-router";
import {PaymentHelper} from "@helpers/PaymentHelper.js";
import UniformPicker from "@ui/UniformPicker/UniformPicker.jsx";

export default function UniformPayments() {
    const {student, academicYear} = useOutletContext()
    return (
        <>
            <PaymentsTable
                student={student}
                academicYear={academicYear}
                btnText={"اضافة حركة مصروفات الزي"}
                type={PaymentHelper.PAYMENT_TYPES.UNIFORM}
            />
            <UniformPicker
                student={student}
                academicYear={academicYear}
            />
        </>
    );
}

