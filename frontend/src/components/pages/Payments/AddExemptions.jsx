import {useOutletContext} from "react-router";
import ItemPicker from "@ui/ItemPicker/ItemPicker.jsx";

export default function AddExemptions() {
    const {student, academicYear} = useOutletContext()
    const purchaseParams = {
        student_id: student.id
    }

    if (!student.note === 'لا يوجد') {
        purchaseParams.type = student.note
    }


    return (
        <>
            <ItemPicker
                student={student}
                academicYear={academicYear}
                config={{
                    purchaseEndpoint: 'exemptions',
                    purchaseParams: purchaseParams,
                    columns: [
                        {key: "value", label: "القيمة", render: (purchase) => purchase.value - 0},
                        {key: "type", label: "النوع"},
                    ],
                    buttonText: "اضافة اعفاء",
                    modalFields: [
                        {
                            name: "type",
                            type: 'text',
                            required: true,
                            placeholder: "النوع",
                            label: "النوع"
                        },
                        {
                            name: "value",
                            type: "number",
                            min: 1,
                            placeholder: "القيمة",
                            label: "القيمة",
                            required: true
                        }
                    ],
                    editable: true,
                    deletable: true,

                }}
            />

        </>
    );
}

