import {useInputModal} from "@contexts/InputModalContext.jsx";
import styles from '@ui/BookPicker/styles.module.css'
import {Button} from "@mui/material";
import {useCreate, useGetAll} from "@hooks/api/useCrud.js";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import {useQueryClient} from "@tanstack/react-query";

export default function UniformPicker({student, academicYear}) {
    const {showInputModal, hideInputModal} = useInputModal()
    const mutation = useCreate('uniform-purchases');
    const {data: uniforms, isLoading} = useGetAll('uniforms', {
        grade: student.classroom.grade, level: student.classroom.level, academic_year: academicYear
    });
    const {data: purchases, isLoading: isLoadingPurchases} = useGetAll('uniform-purchases', {student_id: student.id})
    const {showSnackbar} = useSnackbar();
    const queryClient = useQueryClient()

    const handleUniformAddition = () => {
        showInputModal({
            fields: [
                {
                    name: "uniform_id",
                    type: "select",
                    placeholder: "اختر النسخة",
                    label: "النسخة",
                    options: uniforms?.data?.map(uniform => ({value: uniform.id, label: uniform.type})),
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
                        queryClient.invalidateQueries({
                            queryKey: ["payments", student.id],
                            exact: true
                        })
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
                                الصنف
                            </th>
                            <th className={styles.cell}>
                                المقاس
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
                                    <td className={styles.cell}>{purchase.size}</td>
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
                    onClick={handleUniformAddition}
                    sx={{width: "fit-content"}}
                >
                    إضافة زي
                </Button>
            </div>
        </div>
    );
}
