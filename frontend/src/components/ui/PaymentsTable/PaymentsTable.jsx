import styles from '@ui/BookPicker/styles.module.css'
import {Button} from "@mui/material";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import {useCreate, useGetAll, useUpdate} from "@hooks/api/useCrud.js";
import {useInputModal} from "@contexts/InputModalContext.jsx";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import {useQueryClient} from "@tanstack/react-query";

export default function PaymentsTable({student, type, academicYear, btnText = "اضافة"}) {
    const {data: payments, isLoading} = useGetAll('payments', {
        student_id: student.id, type: type, academic_year: academicYear
    })
    const mutation = useCreate('payments');
    const editMutation = useUpdate('payments');
    const {showInputModal, hideInputModal} = useInputModal();
    const {showSnackbar} = useSnackbar();
    const queryClient = useQueryClient()

    if (isLoading) {
        return <div className={styles.container}>
            <LoadingScreen/>
        </div>
    }

    const handlePaymentAddition = () => {
        showInputModal({
            fields: [
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
            ],
            onSave: (formData) => {
                mutation.mutate({
                    ...formData,
                    student_id: student.id,
                    type: type,
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
                            <th key={'payment-id-header'} className={styles.cell}>رقم الايصال</th>
                            <th className={styles.cell}>التاريخ</th>
                            <th className={styles.cell}>القيمة</th>
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
                                    <td key={`payment-${payment.id}-edit`} className={styles.cell}>
                                        <IconButton onClick={() => handleEdit(payment)}>
                                            <EditIcon sx={{color: 'var(--color-focus)'}}/>
                                        </IconButton>
                                    </td>
                                    <td key={`payment-invoice-${payment.id}`} className={styles.cell}>
                                        <Button variant="contained" color="primary">
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
        </div>
    );
}

