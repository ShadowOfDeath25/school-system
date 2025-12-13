import {PaymentHelper} from "@helpers/PaymentHelper.js";
import PaymentsTable from "@ui/PaymentsTable/PaymentsTable.jsx";
import {useOutletContext} from "react-router";
import ItemPicker from "@ui/ItemPicker/ItemPicker.jsx";

export default function ExtraDues() {
    const {student, academicYear} = useOutletContext()
    return (
        <>
            <ItemPicker
                academicYear={academicYear}
                student={student}
                config={{
                    buttonText: "إضافة مستحقات اضافية",
                    columns: [
                        {label: "القيمة", key: "value"},
                        {label: "البيان", key: "note"},
                    ],

                    purchaseEndpoint: 'extra-dues',
                    purchaseParams: {
                        student_id: student.id,
                        academic_year: academicYear,
                    },
                    modalFields: [
                        {
                            name: "value",
                            required: true,
                            type: "number",
                            placeholder: "القيمة",
                            label: "القيمة",
                            min: 1
                        },
                        {
                            name: "note",
                            type: "text",
                            placeholder: "البيان",
                            label: "البيان"
                        },

                    ]
                }}

            />
            <PaymentsTable
                student={student}
                academicYear={academicYear}
                type={PaymentHelper.PAYMENT_TYPES.TUITION}
                btnText={"اضافة حركة مستحقات اضافية"}
            />
        </>
    );
}

