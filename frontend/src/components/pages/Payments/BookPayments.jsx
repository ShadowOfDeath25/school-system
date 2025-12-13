import {useOutletContext} from "react-router";
import PaymentsTable from "@ui/PaymentsTable/PaymentsTable.jsx";
import {PaymentHelper} from "@helpers/PaymentHelper.js";
import ItemPicker from "@ui/ItemPicker/ItemPicker.jsx";

export default function BookPayments() {
    const {student, academicYear} = useOutletContext()

    return (
        <>
            <PaymentsTable
                student={student}
                type={PaymentHelper.PAYMENT_TYPES.BOOKS}
                academicYear={academicYear}
            />
            <ItemPicker
                student={student}
                academicYear={academicYear}
                config={{
                    resourceName: 'books',
                    purchaseEndpoint: 'book-purchases',
                    buttonText: "اضافة كتب",
                    columns: [
                        {key: "type", label: "النسخة"},
                        {key: "quantity", label: "الكمية"},
                        {key: "price", label: "السعر", render: (purchase) => purchase.price - 0},
                        {key: "total_price", label: "الإجمالي", render: (purchase) => purchase.total_price - 0},
                    ],
                    itemParams: {
                        student_id: student.id,
                        academic_year: academicYear,
                        grade: student.classroom.grade,
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
