import {useInputModal} from "@contexts/InputModalContext.jsx";
import styles from './styles.module.css'
import {Button} from "@mui/material";
import {useCreate, useGetAll} from "@hooks/api/useCrud.js";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";

export default function BookPicker({student, academicYear}) {
    const {showInputModal, hideInputModal} = useInputModal()
    const mutation = useCreate('book-purchases');
    const {data: books, isLoading} = useGetAll('books', {
        grade: student.classroom.grade, level: student.classroom.level, academic_year: academicYear
    });
    const {data: purchases, isLoading: isLoadingPurchases} = useGetAll('book-purchases', {student_id: student.id})
    const {showSnackbar} = useSnackbar();


    const handleBookAddition = () => {
        showInputModal({
            fields: [
                {
                    name: "book_id",
                    type: "select",
                    placeholder: "اختر النسخة",
                    label: "النسخة",
                    options: books?.data?.map(book => ({value: book.id, label: book.type})),
                    required: true
                },
                {
                    name: "quantity",
                    type: "number",
                    placeholder: "الكمية",
                    label: "الكمية",
                    min: 1,
                    helperText: "الكمية المتاحة",
                    required: true,
                    handleChange: (e) => {
                        console.log(e)
                    }

                }
            ],
            onSave: (formData) => {
                mutation.mutate({...formData, student_id: student.id}, {
                    onSuccess: () => {
                        showSnackbar("تم اضافة العنصر بنجاح");
                        hideInputModal();
                    },
                    onError: (error) => {
                        showSnackbar(error?.response?.data?.message ?? "حدث خطأ اثناء اضافة العنصر", "error");
                    }
                });
            },
            isLoading: mutation.isLoading,
            buttonText: "إضافة"

        })
    }
    if (isLoading || isLoadingPurchases) {
        return <div className={styles.container}>
            <LoadingScreen/>
        </div>
    }
    return (
        <div className={styles.container}>
            <div className={styles.tableContainer}>
                {purchases?.data?.length === 0 && (
                    <div className={styles.noData}>
                        لا يوجد بيانات للعرض
                    </div>
                )}
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.cell}>
                                النسخة
                            </th>
                            <th className={styles.cell}>
                                الكمية
                            </th>
                            <th className={styles.cell}>
                                السعر
                            </th>
                            <th className={styles.cell}>
                                الاجمالي
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases?.data?.map(purchase => {
                            return (
                                <tr>
                                    <td className={styles.cell}>{purchase?.type}</td>
                                    <td className={styles.cell}>{purchase.quantity}</td>
                                    <td className={styles.cell}>{purchase.price - 0}</td>
                                    <td className={styles.cell}>{purchase.total_price}</td>
                                </tr>
                            )
                        })}
                    </tbody>

                </table>
            </div>
            <div className={styles.toolbar}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleBookAddition}
                    sx={{width: "fit-content"}}
                >
                    إضافة كتب
                </Button>
            </div>
        </div>
    );
}
