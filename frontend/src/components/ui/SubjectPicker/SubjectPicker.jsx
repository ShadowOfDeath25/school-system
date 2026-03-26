import {useInputModal} from "@contexts/InputModalContext.jsx";
import styles from '@ui/SubjectPicker/styles.module.css';
import {Button} from "@mui/material";
import {useCreate, useGetAll} from "@hooks/api/useCrud.js";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import {useQueryClient, useMutation} from "@tanstack/react-query";
import {useCurrentUser} from "@hooks/api/auth.js";
import {useConfirmModal} from "@contexts/ConfirmModalContext.jsx";
import axiosClient from "../../../axiosClient.js";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton";

/**
 *
 * @param {Object} props
 * @param {Object} props.grade - Grade object
 * @param {string} [props.title] - Optional title for the picker
 * @param {Object} [props.config] - Configuration object
 * @param {string} [props.config.buttonText] - Text for the add button
 * @param {Array} [props.config.columns] - Array of column definitions [{key: string, label: string}]
 * @param {Array} [props.config.modalFields] - Optional custom modal fields.
 * @param {Function} [props.config.formatItemOption] - Optional function to format item options
 * @param {Object} [props.config.subjectParams] - Custom parameters for filtering subjects
 * @param {Object} [props.config.assignedParams] - Custom parameters for filtering the assigned subjects
 * @param {string} language - The language of the grade
 */
export default function SubjectPicker({grade, title, config = {}, language}) {
    const {showInputModal, hideInputModal} = useInputModal();
    const endpoint = `grades/${grade?.id}/subjects`;
    const mutation = useCreate(endpoint);


    const {
        data: subjects,
        isLoading: isLoadingSubjects
    } = useGetAll(`grades/${grade?.id}/subjects/available`, config.subjectParams ?? {
        all: true,
        language: language
    });

    const {data: user, isLoading: userIsLoading} = useCurrentUser();
    const {confirm} = useConfirmModal();

    const deleteMutation = useMutation({
        mutationFn: (ids) => axiosClient.delete(endpoint, {data: {subjects: ids}}),
        onSuccess: () => {
            showSnackbar("تم حذف المادة بنجاح");
            queryClient.invalidateQueries({ queryKey: [endpoint] });
            queryClient.invalidateQueries({ queryKey: [`grades/${grade?.id}/subjects/available`] });
        },
        onError: (error) => {
            showSnackbar(error?.response?.data?.message ?? "حدث خطأ اثناء حذف المادة", "error");
        }
    });

    const updateMutation = useMutation({
        mutationFn: (data) => axiosClient.put(endpoint, data),
        onSuccess: () => {
            showSnackbar("تم تحديث المادة بنجاح");
            hideInputModal();
            queryClient.invalidateQueries({ queryKey: [endpoint] });
        },
        onError: (error) => {
            showSnackbar(error?.response?.data?.message ?? "حدث خطأ اثناء تحديث المادة", "error");
        }
    });

    const userCanEdit = user?.role.includes("Super Admin") || user?.permissions.includes(`update subjects`);
    const userCanDelete = user?.role.includes("Super Admin") || user?.permissions.includes(`delete subjects`);


    const {data: assignedSubjects, isLoading: isLoadingAssigned} = useGetAll(
        endpoint,
        {
            ...config.assignedParams,
            language: language
        },
        {
            enabled: !!grade?.id
        }
    );

    const {showSnackbar} = useSnackbar();
    const queryClient = useQueryClient();

    const defaultFormatItemOption = (item) => ({
        value: item.id,
        label: item.name || item.type || `Subject ${item.id}`
    });

    const formatItemOption = config.formatItemOption || defaultFormatItemOption;

    const columns = config.columns ?? [
        {key: 'name', label: 'اسم المادة'},
        {key: 'type', label: 'النوع'},
        {key: 'language', label: 'اللغة'},
        {key: 'min_marks', label: 'الدرجة الصغرى'},
        {key: 'max_marks', label: 'الدرجة النهائية'},
        {
            key: 'added_to_total',
            label: 'تضاف للمجموع',
            render: (subject) => (subject.added_to_total ? 'نعم' : 'لا')
        },
        {
            key: 'added_to_report',
            label: 'تضاف للتقرير',
            render: (subject) => (subject.added_to_report ? 'نعم' : 'لا')
        },
        {key: 'semester', label: 'الفصل الدراسي'},
        {key: 'classwork_marks', label: 'درجات اعمال السنة'},
        {key: 'exam_marks', label: 'درجات الامتحان'},
    ];

    const buttonText = config.buttonText || "إضافة مادة";

    const handleItemAddition = () => {
        showInputModal({
            fields: config.modalFields ?? [
                {
                    name: "subject_id",
                    type: "select",
                    required: true,
                    placeholder: "اختر المادة",
                    label: "المادة",
                    options: subjects?.data?.map(formatItemOption) || []
                },
                {
                    name: "min_marks",
                    type: "number",
                    required: true,
                    label: "الدرجة الصغري",
                    placeholder: "الدرجة الصغري",
                    min: 0
                },
                {
                    name: "max_marks",
                    type: "number",
                    required: true,
                    label: "الدرجة النهائية",
                    placeholder: "الدرجة النهائية",
                    min: 0
                },
                {
                    name: "classwork_marks",
                    type: "number",
                    required: true,
                    label: "درجة اعمال السنة",
                    placeholder: "درجة اعمال السنة",
                    min: 0
                },
                {
                    name: "added_to_total",
                    type: "checkbox",
                    label: "تضاف للمجموع",

                    value: false
                },
                {
                    name: "added_to_report",
                    type: "checkbox",
                    label: "تضاف للتقرير",

                    value: false
                },
                {
                    name: "semester",
                    required: true,
                    label: "الفصل الدراسي",
                    type: "select",
                    options: [
                        {value: "الاول", label: "الاول"},
                        {value: "الثاني", label: "الثاني"},
                        {value: "طوال العام", label: "طوال العام"}
                    ]
                },


            ],
            onSave: (formData) => {
                formData.language = language
                mutation.mutate(formData, {
                    onSuccess: () => {
                        showSnackbar("تم اضافة المادة بنجاح");
                        hideInputModal();
                        queryClient.invalidateQueries({ queryKey: [endpoint] });
                        queryClient.invalidateQueries({ queryKey: [`grades/${grade?.id}/subjects/available`] });
                    },
                    onError: (error) => {
                        showSnackbar(
                            error?.response?.data?.message ?? "حدث خطأ اثناء اضافة المادة",
                            "error"
                        );
                    }
                });
            },
            isLoading: mutation.isLoading,
            buttonText: buttonText
        });
    };

    const handleRowDelete = async (id) => {
        const confirmed = await confirm({
            message: "هل أنت متأكد من حذف هذه المادة؟",
            warning: 'حذف هذه المادة قد يؤدي لحذف البيانات المرتبطة بها'
        });
        if (confirmed) {
            deleteMutation.mutate([id]);
        }
    };

    const handleEditClick = (subject) => {
        showInputModal({
            fields: [
                {
                    name: "min_marks",
                    type: "number",
                    required: true,
                    label: "الدرجة الصغري",
                    value: subject.min_marks,
                    min: 0
                },
                {
                    name: "max_marks",
                    type: "number",
                    required: true,
                    label: "الدرجة النهائية",
                    value: subject.max_marks,
                    min: 0
                },
                {
                    name: "classwork_marks",
                    type: "number",
                    required: true,
                    label: "درجة اعمال السنة",
                    value: subject.classwork_marks,
                    min: 0
                },
                {
                    name: "added_to_total",
                    type: "checkbox",
                    label: "تضاف للمجموع",
                    value: !!subject.added_to_total
                },
                {
                    name: "added_to_report",
                    type: "checkbox",
                    label: "تضاف للتقرير",
                    value: !!subject.added_to_report
                },
                {
                    name: "semester",
                    required: true,
                    label: "الفصل الدراسي",
                    type: "select",
                    value: subject.semester,
                    options: [
                        {value: "الاول", label: "الاول"},
                        {value: "الثاني", label: "الثاني"},
                        {value: "طوال العام", label: "طوال العام"}
                    ]
                },
            ],
            onSave: (formData) => {

                formData.subject_id = subject.id;
                updateMutation.mutate(formData);
            },
            isLoading: updateMutation.isLoading,
            buttonText: "حفظ التغييرات"
        });
    };

    if (isLoadingSubjects || isLoadingAssigned || userIsLoading) {
        return (
            <div className={styles.container}>
                <LoadingScreen/>
            </div>
        );
    }

    const pickerTitle = title || config.title;
    return (
        <div className={styles.container}>
            {pickerTitle && <h2 className={styles.title}>{pickerTitle}</h2>}
            <div className={styles.tableContainer}>
                {(!assignedSubjects?.data || assignedSubjects.data.length === 0) && (
                    <div className={styles.noData}>
                        لا يوجد بيانات للعرض
                    </div>
                )}
                <table className={styles.table}>
                    <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th key={index} className={styles.cell}>
                                    {column.label}
                                </th>
                            ))}
                            {userCanEdit && <th className={styles.cell}>تعديل</th>}
                            {userCanDelete && <th className={styles.cell}>حذف</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {assignedSubjects?.data?.map((subject, index) => (
                            <tr key={index}>
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} className={styles.cell}>
                                        {column.render
                                            ? column.render(subject)
                                            : subject[column.key]}
                                    </td>
                                ))}
                                {userCanEdit && (
                                    <td className={styles.cell}>
                                        <IconButton onClick={() => handleEditClick(subject)}>
                                            <EditIcon sx={{color: "var(--color-focus)"}}/>
                                        </IconButton>
                                    </td>
                                )}
                                {userCanDelete && (
                                    <td className={styles.cell}>
                                        <IconButton onClick={() => handleRowDelete(subject.id)}>
                                            <DeleteIcon sx={{color: 'var(--color-danger)'}}/>
                                        </IconButton>
                                    </td>
                                )}
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
                    {buttonText}
                </Button>
            </div>
        </div>
    );
}
