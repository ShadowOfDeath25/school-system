import PaymentsTable from "@ui/PaymentsTable/PaymentsTable.jsx";
import {useOutletContext} from "react-router";
import {PaymentHelper} from "@helpers/PaymentHelper.js";
import ItemPicker from "@ui/ItemPicker/ItemPicker.jsx";

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
            <ItemPicker
                student={student}
                academicYear={academicYear}
                config={{
                    resourceName: 'uniform',
                    purchaseEndpoint: 'uniform-purchases',
                    buttonText: "اضافة زي",
                    columns: [
                        {key: "type", label: "النسخة"},
                        {key: "quantity", label: "الكمية"},
                        {key: "size", label: "المقاس"},
                        {key: "price", label: "السعر", render: (purchase) => purchase.price - 0},
                        {key: "total_price", label: "الإجمالي", render: (purchase) => purchase.total_price - 0},
                    ],
                    itemParams: {
                        student_id: student.id,
                        academic_year: academicYear,
                        level: student.classroom.level
                    },
                    purchaseParams: {
                        student_id: student.id,
                        academic_year: academicYear
                    },

                }}
            />
        </>
    );
}

