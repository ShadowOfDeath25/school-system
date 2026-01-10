import styles from '@ui/ItemPicker/styles.module.css'
import {useState} from 'react';
import InvoiceModal from '@ui/InvoiceModal/InvoiceModal.jsx';
import {Button} from "@mui/material";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import {useCreate, useGetAll, useUpdate} from "@hooks/api/useCrud.js";
import {useInputModal} from "@contexts/InputModalContext.jsx";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import {useQueryClient} from "@tanstack/react-query";
import {PaymentHelper} from "../../../utils/helpers/PaymentHelper.js";
import {useOutletContext} from "react-router";

export default function PaymentsTable({student, type, types, academicYear, btnText = "اضافة"}) {
    const paymentTypes = types || (type ? [type] : undefined);

    const {data: payments, isLoading} = useGetAll('payments', {
        student_id: student.id,
        type: paymentTypes,
        academic_year: academicYear,
        all: true
    })
    const showType = !!types
    const mutation = useCreate('payments');
    const editMutation = useUpdate('payments');
    const {showInputModal, hideInputModal} = useInputModal();
    const {showSnackbar} = useSnackbar();
    const queryClient = useQueryClient()
    const [selectedInvoicePayment, setSelectedInvoicePayment] = useState(null);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const context = useOutletContext()
    console.log("current user:", context)
    let modalFields = [
        {
            name: "value",
            type: "number",
            min: 1,
            label: "القيمة",
            placeholder: "القيمة",
            required: true
        },
        {
            name: "date",
            type: "date",
            value: new Date(Date.now()).toISOString().slice(0, 10),
            label: "بتاريخ",
            required: true
        }
    ]
    if (student.withdrawn && type === PaymentHelper.PAYMENT_TYPES.ADMINISTRATIVE) {
        modalFields.push({
            name: "type",
            type: "select",
            label: "النوع",
            required: true,
            placeholder: "اختر النوع",
            options: [PaymentHelper.PAYMENT_TYPES.WITHDRAWAL, PaymentHelper.PAYMENT_TYPES.ADMINISTRATIVE]
        })
    }

    if (isLoading) {
        return <div className={styles.container}>
            <LoadingScreen/>
        </div>
    }

    const handlePaymentAddition = () => {
        showInputModal({
            fields: modalFields,
            onSave: (formData) => {
                mutation.mutate({
                    ...formData,
                    student_id: student.id,
                    type: formData.type ?? type,
                    language: student.classroom.language,
                    level: student.classroom.level,
                    academic_year: academicYear
                }, {
                    onSuccess: () => {
                        showSnackbar("تم إضافة العنصر بنجاح")
                        hideInputModal();
                        queryClient.invalidateQueries({
                            queryKey: ["payments", student.id],
                            exact: true
                        })
                    },
                    onError: (error) => {
                        showSnackbar(error?.response?.data?.message ?? "حدث خطأ اثناء إضافة العنصر", "error")
                    }
                })
            },
            buttonText: "إضافة",
        })
    }

    const handleEdit = (payment) => {
        showInputModal({
            item: payment,
            fields: [
                {
                    name: "value",
                    type: "number",
                    min: 1,
                    label: "القيمة",
                    placeholder: "القيمة",
                    required: true,

                },
                {
                    name: "date",
                    type: "date",
                    label: "بتاريخ",
                    required: true
                }
            ],
            onSave: (formData) => {
                editMutation.mutate({...formData}, {
                    onSuccess: () => {
                        hideInputModal();
                        showSnackbar("تم تحديث العنصر بنجاح")
                        queryClient.invalidateQueries({
                            queryKey: ["payments", student.id],
                            exact: true
                        })
                    },
                    onError: (error) => {
                        showSnackbar(error?.response?.data?.message ?? "حدث خطأ اثناء تحديث العنصر", "error");
                    }
                })
            }
        })
    }

    const handleShowInvoice = (payment) => {
        setSelectedInvoicePayment(payment);
        setIsInvoiceModalOpen(true);
    }


    return (
        <div className={styles.container}>
            <div className={styles.tableContainer}>
                {payments?.data?.length === 0 && (
                    <div className={styles.noData}>
                        لا يوجد بيانات للعرض
                    </div>
                )}
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.cell}>رقم الايصال</th>
                            <th className={styles.cell}>التاريخ</th>
                            <th className={styles.cell}>القيمة</th>
                            {showType && <th className={styles.cell}>النوع</th>}
                            <th className={styles.cell}>تعديل</th>
                            <th className={styles.cell}>عرض الايصال</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments?.data?.map((payment) => {
                            return (
                                <tr key={`payment-${payment.id}`}>
                                    <td key={`payment-${payment.id}-id`} className={styles.cell}>{payment.id}</td>
                                    <td key={`payment-${payment.id}-date`}
                                        className={styles.cell}>{payment.date.replaceAll('-', '/')}</td>
                                    <td key={`payment-${payment.id}-value`}
                                        className={styles.cell}>{payment.value - 0}</td>
                                    {showType && <td key={`payment-${payment.id}-type`}
                                                     className={styles.cell}
                                    >
                                        {payment.type}
                                    </td>}
                                    <td key={`payment-${payment.id}-edit`} className={styles.cell}>
                                        <IconButton onClick={() => handleEdit(payment)}>
                                            <EditIcon sx={{color: 'var(--color-focus)'}}/>
                                        </IconButton>
                                    </td>
                                    <td key={`payment-invoice-${payment.id}`} className={styles.cell}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleShowInvoice(payment)}
                                        >
                                            عرض الإيصال
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div className={styles.toolbar}>
                <Button
                    variant={"contained"}
                    onClick={handlePaymentAddition}
                >
                    {btnText}
                </Button>
            </div>
            <InvoiceModal
                open={isInvoiceModalOpen}
                onClose={() => setIsInvoiceModalOpen(false)}
                payment={selectedInvoicePayment}
                student={student}
                academicYear={academicYear}
                paymentsData={{

                }}

            />
        </div>
    );
}

