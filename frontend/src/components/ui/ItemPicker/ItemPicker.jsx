import {useInputModal} from "@contexts/InputModalContext.jsx";
import styles from '@ui/BookPicker/styles.module.css';
import {Button} from "@mui/material";
import {useCreate, useGetAll} from "@hooks/api/useCrud.js";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import {useQueryClient} from "@tanstack/react-query";

/**
 *
 * @param {Object} props
 * @param {Object} props.student - Student object
 * @param {string|number} props.academicYear - Academic year
 * @param {Object} props.config - Configuration object
 * @param {string} props.config.purchaseEndpoint
 * @param {string} [props.config.resourceName] - Name of the resource (e.g., 'books', 'uniforms')
 * @param {string} props.config.buttonText - Text for the add button
 * @param {Array} props.config.columns - Array of column definitions [{key: string, label: string}]
 * @param {Array} [props.config.modalFields] - Optional custom modal fields. If not provided, defaults to item select + quantity
 * @param {Function} props.config.formatItemOption - Optional function to format item options (item => ({value, label}))
 * @param {Object} props.config.itemParams - Custom parameters for filtering the data {param1:value1, param2:value2}
 * @param {Object} props.config.purchaseParams - Custom parameters for filtering the Purchase data [{param1:value1, param2:value2}]
 * @param {Boolean} [props.config.editable] - A boolean to specify if the records are editable or not
 * @param {Boolean} [props.config.deletable]- A boolean to specify if the records are deletable or not
 * @param {Function} [props.config.columns.render] - A function to customize how each column is rendered
 * @param {Array} [props.config.additionalModalFields] - An array of fields to be added on top of the default fields.
 */
export default function ItemPicker({student, academicYear, config}) {
    const {showInputModal, hideInputModal} = useInputModal();
    const mutation = useCreate(config.purchaseEndpoint);
    const {data: items, isLoading} = useGetAll(config.resourceName, config.itemParams ?? {
        grade: student.classroom.grade,
        level: student.classroom.level,
        academic_year: academicYear
    }, {
        enabled: !!config.resourceName
    });
    const {data: purchases, isLoading: isLoadingPurchases} = useGetAll(
        config.purchaseEndpoint,
        config.purchaseParams ?? {student_id: student.id},
        {
            enabled: !!config.purchaseEndpoint,
        }
    );
    const {showSnackbar} = useSnackbar();
    const queryClient = useQueryClient();


    const defaultFormatItemOption = (item) => ({
        value: item.id,
        label: item.type
    });

    const formatItemOption = config.formatItemOption || defaultFormatItemOption;
    const additionalModalFields = config.additionalModalFields ? config.additionalModalFields : []

    const handleItemAddition = () => {
        showInputModal({
            fields: config.modalFields ?? [
                {
                    name: config.resourceName.slice(0, -1) + "_id",
                    type: "select",
                    required: true,
                    placeholder: "اختر النوع",
                    label: "النوع",
                    options: items?.data?.map(formatItemOption)
                },
                ...additionalModalFields,
                {
                    name: 'quantity',
                    type: 'number',
                    min: 1,
                    label: "الكمية",
                    placeholder: "الكمية",
                    required: true,
                },
            ],
            onSave: (formData) => {
                mutation.mutate({...formData, student_id: student.id, academic_year: academicYear}, {
                    onSuccess: () => {
                        showSnackbar("تم اضافة العنصر بنجاح");
                        hideInputModal();
                        queryClient.invalidateQueries({
                            queryKey: ["payments", student.id],
                            exact: true
                        });
                    },
                    onError: (error) => {
                        showSnackbar(
                            error?.response?.data?.message ?? "حدث خطأ اثناء اضافة العنصر",
                            "error"
                        );
                    }
                });
            },
            isLoading: mutation.isLoading,
            buttonText: "إضافة"
        });
    };

    if (isLoading || isLoadingPurchases) {
        return (
            <div className={styles.container}>
                <LoadingScreen/>
            </div>
        );
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
                            {config.columns.map((column, index) => (
                                <th key={index} className={styles.cell}>
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {purchases?.data?.map((purchase, index) => (
                            <tr key={index}>
                                {config.columns.map((column, colIndex) => (
                                    <td key={colIndex} className={styles.cell}>
                                        {column.render
                                            ? column.render(purchase)
                                            : purchase[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className={styles.toolbar}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleItemAddition}
                    sx={{width: "fit-content"}}
                >
                    {config.buttonText}
                </Button>
            </div>
        </div>
    );
}
