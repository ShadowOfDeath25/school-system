import {useState} from "react";
import styles from '@ui/SubjectPicker/styles.module.css';
import {Button, Dialog, DialogActions, DialogContent, IconButton, Tooltip} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InputField from "@ui/InputField/InputField.jsx";
import SelectField from "@ui/SelectField/SelectField.jsx";
import {useCreate, useGetAll} from "@hooks/api/useCrud.js";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import {useQueryClient, useMutation} from "@tanstack/react-query";
import {useCurrentUser} from "@hooks/api/auth.js";
import {useConfirmModal} from "@contexts/ConfirmModalContext.jsx";
import axiosClient from "../../../axiosClient.js";

const semesterOptions = [
    {value: 'الاول', label: 'الأول'},
    {value: 'الثاني', label: 'الثاني'},
    {value: 'طوال العام', label: 'طوال العام'},
];

const semesterAliases = {
    'Ø§Ù„Ø§ÙˆÙ„': 'الاول',
    'Ø§Ù„Ø«Ø§Ù†ÙŠ': 'الثاني',
    'Ø·ÙˆØ§Ù„ Ø§Ù„Ø¹Ø§Ù…': 'طوال العام',
};

const monthlyExamNames = {
    'الاول': ['شهري اكتوبر', 'شهري نوفمبر'],
    'الثاني': ['شهري مارس', 'شهري ابريل'],
};

const blankComponent = () => ({
    id: '',
    name: '',
    marks: '',
    is_final_exam: false,
    is_monthly_exam: false,
});

const normalizeSemester = (semester) => semesterAliases[semester] ?? semester ?? '';

const normalizeComponentId = (id, index) => {
    const fallback = `component_${index + 1}`;
    return (id || fallback)
        .toString()
        .trim()
        .replace(/\s+/g, '_') || fallback;
};

const isYearLongSemester = (semester) => normalizeSemester(semester) === 'طوال العام';

const isExpandedSemesterComponent = (component) => (
    component.id?.endsWith('_first_semester') || component.id?.endsWith('_second_semester')
);

const getDisplayedTotalMarks = (subject) => {
    const total = Number(subject.total_marks ?? 0);
    return isYearLongSemester(subject.semester) ? total / 2 : total;
};
const serializeComponents = (components, semester) => {
    const normalizedComponents = components.map((component, index) => ({
        id: normalizeComponentId(component.id, index),
        name: component.name,
        marks: Number(component.marks),
        is_final_exam: !!component.is_final_exam,
        is_monthly_exam: !!component.is_monthly_exam,
    }));

    if (!isYearLongSemester(semester)) {
        return normalizedComponents;
    }

    return normalizedComponents.flatMap((component) => {
        if (component.is_monthly_exam || isExpandedSemesterComponent(component)) {
            return [component];
        }

        return [
            {
                ...component,
                id: `${component.id}_first_semester`,
                name: `${component.name} - الأول`,
            },
            {
                ...component,
                id: `${component.id}_second_semester`,
                name: `${component.name} - الثاني`,
            },
        ];
    });
};

const toEditorValues = ({subject, includeSubject}) => ({
    subject_id: includeSubject ? '' : subject?.id,
    min_marks: subject?.min_marks ?? 0,
    added_to_total: subject ? !!subject.added_to_total : true,
    added_to_report: subject ? !!subject.added_to_report : true,
    semester: normalizeSemester(subject?.semester),
    use_monthly_median: subject ? !!subject.use_monthly_median : false,
});

const toEditorComponents = (subject) => {
    const components = subject?.components?.length ? subject.components : [blankComponent()];

    return components.map((component, index) => ({
        id: component.id ?? '',
        name: component.name ?? '',
        marks: component.marks ?? '',
        is_final_exam: !!component.is_final_exam,
        is_monthly_exam: !!component.is_monthly_exam,
    }));
};

function SubjectGradingModal({
                                 open,
                                 mode,
                                 subjects,
                                 formatItemOption,
                                 subject,
                                 onCancel,
                                 onSave,
                                 isLoading,
                             }) {
    const {showSnackbar} = useSnackbar();
    const includeSubject = mode === 'create';
    const [values, setValues] = useState(() => toEditorValues({subject, includeSubject}));
    const [components, setComponents] = useState(() => toEditorComponents(subject));

    const normalizedSem = normalizeSemester(values.semester);
    const hasSemester = !!normalizedSem;
    const isYearLong = isYearLongSemester(normalizedSem);
    const hasMonthlyExams = components.some(c => c.is_monthly_exam);

    const calculateTotalMarks = () => {
        const serialized = serializeComponents(components, values.semester);
        if (values.use_monthly_median) {
            if (isYearLongSemester(values.semester)) {
                const s1Monthly = serialized.filter(c => c.is_monthly_exam && (c.id?.includes('first_semester') || c.id?.includes('s1')));
                const s2Monthly = serialized.filter(c => c.is_monthly_exam && (c.id?.includes('second_semester') || c.id?.includes('s2')));
                const otherMonthly = serialized.filter(c => c.is_monthly_exam && !s1Monthly.includes(c) && !s2Monthly.includes(c));

                const s1Avg = s1Monthly.length > 0 ? (s1Monthly.reduce((s, c) => s + Number(c.marks || 0), 0) / s1Monthly.length) : 0;
                const s2Avg = s2Monthly.length > 0 ? (s2Monthly.reduce((s, c) => s + Number(c.marks || 0), 0) / s2Monthly.length) : 0;
                const otherAvg = otherMonthly.length > 0 ? (otherMonthly.reduce((s, c) => s + Number(c.marks || 0), 0) / otherMonthly.length) : 0;

                const nonMonthly = serialized.filter(c => !c.is_monthly_exam);
                const nonMonthlySum = nonMonthly.reduce((sum, c) => sum + Number(c.marks || 0), 0);

                const totalYear = nonMonthlySum + s1Avg + s2Avg + otherAvg;
                const perSemester = totalYear / 2;
                return Math.round(perSemester * 10) / 10;
            }

            const monthly = serialized.filter(c => c.is_monthly_exam);
            const nonMonthly = serialized.filter(c => !c.is_monthly_exam);
            const nonMonthlySum = nonMonthly.reduce((sum, c) => sum + Number(c.marks || 0), 0);
            const monthlyAvg = monthly.length > 0
                ? (monthly.reduce((sum, c) => sum + Number(c.marks || 0), 0) / monthly.length)
                : 0;
            const total = nonMonthlySum + monthlyAvg;
            return Math.round(total * 10) / 10;
        }

        const sum = serialized.reduce((sum, c) => sum + Number(c.marks || 0), 0);
        return isYearLongSemester(values.semester) ? sum / 2 : sum;
    };

    const totalMarks = calculateTotalMarks();
    const totalMarksLabel = isYearLongSemester(values.semester)
        ? 'إجمالي درجات الفصل الواحد'
        : 'إجمالي درجات المادة';

    const addMonthlyExams = () => {
        if (hasMonthlyExams) {
            showSnackbar('تم إضافة الامتحانات الشهرية مسبقاً', 'warning');
            return;
        }

        if (!hasSemester) {
            showSnackbar('يرجى اختيار الفصل الدراسي أولاً', 'error');
            return;
        }

        let newMonthlyComps = [];

        if (isYearLong) {
            newMonthlyComps = [
                {
                    id: 'monthly_october_first_semester',
                    name: 'شهري اكتوبر',
                    marks: '',
                    is_final_exam: false,
                    is_monthly_exam: true,
                },
                {
                    id: 'monthly_november_first_semester',
                    name: 'شهري نوفمبر',
                    marks: '',
                    is_final_exam: false,
                    is_monthly_exam: true,
                },
                {
                    id: 'monthly_march_second_semester',
                    name: 'شهري مارس',
                    marks: '',
                    is_final_exam: false,
                    is_monthly_exam: true,
                },
                {
                    id: 'monthly_april_second_semester',
                    name: 'شهري ابريل',
                    marks: '',
                    is_final_exam: false,
                    is_monthly_exam: true,
                },
            ];
        } else {
            const names = monthlyExamNames[normalizedSem];
            if (!names) {
                showSnackbar('يرجى اختيار فصل دراسي صحيح', 'error');
                return;
            }

            newMonthlyComps = names.map((name, i) => ({
                id: `monthly_${normalizedSem === 'الاول' ? 's1' : 's2'}_${i + 1}`,
                name,
                marks: '',
                is_final_exam: false,
                is_monthly_exam: true,
            }));
        }

        setComponents((current) => {
            const filtered = current.filter(c => (c.name || '').trim() !== '' || c.marks !== '');
            return [...(filtered.length ? filtered : []), ...newMonthlyComps];
        });
    };

    let monthlyButtonDisabled = false;
    let monthlyButtonTooltip = '';

    if (!hasSemester) {
        monthlyButtonDisabled = true;
        monthlyButtonTooltip = 'يرجى اختيار الفصل الدراسي أولاً';
    } else if (hasMonthlyExams) {
        monthlyButtonDisabled = true;
        monthlyButtonTooltip = 'تم إضافة الامتحانات الشهرية مسبقاً';
    }

    const updateValue = (event) => {
        const {name, value, type, checked} = event.target;
        if (name === 'semester') {
            const oldSem = normalizeSemester(values.semester);
            const newSem = normalizeSemester(value);
            if (oldSem !== newSem) {
                setComponents((current) => {
                    const withoutMonthly = current.filter(c => !c.is_monthly_exam);
                    return withoutMonthly.length ? withoutMonthly : [blankComponent()];
                });
            }
        }
        setValues((current) => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const updateComponent = (index, field, value) => {
        setComponents((current) => current.map((component, componentIndex) => {
            if (componentIndex === index) {
                if (field === 'name' && component.is_monthly_exam) {
                    return component;
                }
                return {...component, [field]: value};
            }
            return component;
        }));
    };

    const addComponent = () => {
        setComponents((current) => [...current, blankComponent()]);
    };

    const removeComponent = (index) => {
        setComponents((current) => current.length === 1
            ? current
            : current.filter((_, componentIndex) => componentIndex !== index)
        );
    };

    const submit = (event) => {
        event.preventDefault();
        onSave({
            ...values,
            components: serializeComponents(components, values.semester),
        });
    };

    return (
        <Dialog
            open={open}
            onClose={onCancel}
            fullWidth
            maxWidth="md"
            className="editModal"
            disableEscapeKeyDown={isLoading}
        >
            <DialogContent className={styles.modalContent}>
                <form id="subject-grading-form" className={styles.modalForm} onSubmit={submit}>
                    {includeSubject && (
                        <SelectField
                            name="subject_id"
                            label="المادة"
                            placeholder="اختر المادة"
                            value={values.subject_id}
                            handleChange={updateValue}
                            options={subjects?.data?.map(formatItemOption) || []}
                            isModal
                        />
                    )}

                    <div className={styles.modalGrid}>
                        <InputField
                            name="min_marks"
                            type="number"
                            label="درجة النجاح"
                            placeholder="درجة النجاح"
                            min={0}
                            value={values.min_marks}
                            handleChange={updateValue}
                            isModal
                        />
                        <SelectField
                            name="semester"
                            label="الفصل الدراسي"
                            placeholder="اختر الفصل الدراسي"
                            value={values.semester}
                            handleChange={updateValue}
                            options={semesterOptions}
                            isModal
                        />
                        <InputField
                            name="added_to_total"
                            type="checkbox"
                            label="تضاف للمجموع"
                            value={values.added_to_total}
                            handleChange={updateValue}
                            isModal
                        />
                        <InputField
                            name="added_to_report"
                            type="checkbox"
                            label="تضاف للتقرير"
                            value={values.added_to_report}
                            handleChange={updateValue}
                            isModal
                        />
                    </div>

                    <div className={styles.componentsEditorHeader}>
                        <h3>تقسيم الدرجات</h3>
                        <div className={styles.editorHeaderActions}>
                            <Tooltip title={monthlyButtonTooltip} arrow>
                                <span>
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        color="primary"
                                        onClick={addMonthlyExams}
                                        disabled={monthlyButtonDisabled}
                                    >
                                        اضافة امتحانات شهرية
                                    </Button>
                                </span>
                            </Tooltip>
                            <Button
                                type="button"
                                variant="contained"
                                color="primary"
                                onClick={addComponent}
                            >
                                إضافة مكون
                            </Button>
                        </div>
                    </div>

                    <div className={styles.componentsEditor}>
                        {components.map((component, index) => (
                            <div
                                className={`${styles.componentRow} ${component.is_monthly_exam ? styles.monthlyComponentRow : ''}`}
                                key={`${component.id || 'component'}-${index}`}
                            >
                                <div className={styles.componentField}>
                                    <InputField
                                        name={`component_name_${index}`}
                                        type="text"
                                        label="اسم المكون"
                                        placeholder="اسم المكون"
                                        value={component.name}
                                        handleChange={(event) => updateComponent(index, 'name', event.target.value)}
                                        disabled={component.is_monthly_exam}
                                        readOnly={component.is_monthly_exam}
                                        isModal
                                    />
                                </div>
                                <div className={styles.componentField}>
                                    <InputField
                                        name={`component_marks_${index}`}
                                        type="number"
                                        label="الدرجة"
                                        placeholder="الدرجة"
                                        min={1}
                                        value={component.marks}
                                        handleChange={(event) => updateComponent(index, 'marks', event.target.value)}
                                        isModal
                                    />
                                </div>
                                <label className={`${styles.finalExamToggle} ${component.is_monthly_exam ? styles.disabledToggle : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={!!component.is_final_exam}
                                        disabled={component.is_monthly_exam}
                                        onChange={(event) => updateComponent(index, 'is_final_exam', event.target.checked)}
                                    />
                                    <span>اختبار نهائي</span>
                                </label>
                                {!component.is_monthly_exam && (
                                    <IconButton
                                        type="button"
                                        onClick={() => removeComponent(index)}
                                        disabled={components.length === 1}
                                        className={styles.removeComponentButton}
                                    >
                                        <DeleteIcon/>
                                    </IconButton>
                                )}
                            </div>
                        ))}
                    </div>

                    {hasMonthlyExams && (
                        <div className={styles.medianOption}>
                            <InputField
                                name="use_monthly_median"
                                type="checkbox"
                                label="استخدام متوسط الامتحانات الشهرية"
                                value={values.use_monthly_median}
                                handleChange={updateValue}
                                isModal
                            />
                        </div>
                    )}

                    <div className={styles.totalMarks}>
                        {totalMarksLabel}: {totalMarks}
                    </div>
                </form>
            </DialogContent>
            <DialogActions className={styles.modalActions}>
                <Button onClick={onCancel} sx={{color: 'var(--btn-ghost-text)'}} disabled={isLoading}>
                    إلغاء
                </Button>
                <Button form="subject-grading-form" type="submit" variant="contained" color="primary"
                        disabled={isLoading}>
                    {isLoading ? 'جاري الحفظ...' : 'حفظ'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default function SubjectPicker({grade, title, config = {}, language}) {
    const endpoint = `grades/${grade?.id}/subjects`;
    const mutation = useCreate(endpoint);
    const [editor, setEditor] = useState(null);

    const {
        data: subjects,
        isLoading: isLoadingSubjects
    } = useGetAll(`grades/${grade?.id}/subjects/available`, config.subjectParams ?? {
        all: true,
        language: language
    });

    const {data: user, isLoading: userIsLoading} = useCurrentUser();
    const {confirm} = useConfirmModal();
    const {showSnackbar} = useSnackbar();
    const queryClient = useQueryClient();

    const closeEditor = () => setEditor(null);

    const validateEditorData = (data, mode) => {
        if (mode === 'create' && !data.subject_id) {
            showSnackbar('يرجى اختيار المادة', 'error');
            return false;
        }

        if (!data.semester) {
            showSnackbar('يرجى اختيار الفصل الدراسي', 'error');
            return false;
        }

        if (!data.components.length) {
            showSnackbar('يجب إضافة مكون واحد على الأقل', 'error');
            return false;
        }

        if (data.components.some((component) => !component.name || Number(component.marks) <= 0)) {
            showSnackbar('يرجى إدخال اسم ودرجة صحيحة لكل مكون', 'error');
            return false;
        }

        if (!data.components.some((component) => component.is_final_exam)) {
            showSnackbar('يجب تحديد مكون واحد على الأقل كاختبار نهائي', 'error');
            return false;
        }

        return true;
    };

    const deleteMutation = useMutation({
        mutationFn: (ids) => axiosClient.delete(endpoint, {data: {subjects: ids}}),
        onSuccess: () => {
            showSnackbar('تم حذف المادة بنجاح');
            queryClient.invalidateQueries({queryKey: [endpoint]});
            queryClient.invalidateQueries({queryKey: [`grades/${grade?.id}/subjects/available`]});
        },
        onError: (error) => {
            showSnackbar(error?.response?.data?.message ?? 'حدث خطأ أثناء حذف المادة', 'error');
        }
    });

    const updateMutation = useMutation({
        mutationFn: (data) => axiosClient.put(endpoint, data),
        onSuccess: () => {
            showSnackbar('تم تحديث المادة بنجاح');
            closeEditor();
            queryClient.invalidateQueries({queryKey: [endpoint]});
        },
        onError: (error) => {
            showSnackbar(error?.response?.data?.message ?? 'حدث خطأ أثناء تحديث المادة', 'error');
        }
    });

    const userCanEdit = user?.role.includes('Super Admin') || user?.permissions.includes('update grade-subjects');
    const userCanDelete = user?.role.includes('Super Admin') || user?.permissions.includes('delete grade-subjects');

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

    const defaultFormatItemOption = (item) => ({
        value: item.id,
        label: item.name || item.type || `مادة ${item.id}`
    });

    const formatItemOption = config.formatItemOption || defaultFormatItemOption;

    const columns = config.columns ?? [
        {key: 'name', label: 'اسم المادة'},
        {key: 'type', label: 'النوع'},
        {key: 'language', label: 'اللغة'},
        {key: 'min_marks', label: 'درجة النجاح'},
        {key: 'total_marks', label: 'إجمالي الدرجات', render: getDisplayedTotalMarks},
        {
            key: 'components',
            label: 'تقسيم الدرجات',
            render: (subject) => (
                <div className={styles.componentsList}>
                    {subject.components?.map((component) => (
                        <span key={component.id} className={styles.componentItem}>
                            {component.name}: {component.marks} {component.is_final_exam ? ' - نهائي' : ''} {component.is_monthly_exam ? ' - شهري' : ''}
                        </span>
                    ))}
                </div>
            )
        },
        {
            key: 'use_monthly_median',
            label: 'متوسط الشهري',
            render: (subject) => (subject.use_monthly_median ? 'نعم' : 'لا')
        },
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
    ];

    const buttonText = config.buttonText || 'إضافة مادة';

    const handleSave = (data) => {
        const mode = editor?.mode ?? 'create';

        if (!validateEditorData(data, mode)) {
            return;
        }

        const payload = {
            subject_id: mode === 'edit' ? editor.subject.id : data.subject_id,
            min_marks: Number(data.min_marks ?? 0),
            added_to_total: !!data.added_to_total,
            added_to_report: !!data.added_to_report,
            semester: data.semester,
            language,
            components: data.components,
            use_monthly_median: !!data.use_monthly_median,
        };

        if (mode === 'edit') {
            updateMutation.mutate(payload);
            return;
        }

        mutation.mutate(payload, {
            onSuccess: () => {
                showSnackbar('تم إضافة المادة بنجاح');
                closeEditor();
                queryClient.invalidateQueries({queryKey: [endpoint]});
                queryClient.invalidateQueries({queryKey: [`grades/${grade?.id}/subjects/available`]});
            },
            onError: (error) => {
                showSnackbar(
                    error?.response?.data?.message ?? 'حدث خطأ أثناء إضافة المادة',
                    'error'
                );
            }
        });
    };

    const handleRowDelete = async (id) => {
        const confirmed = await confirm({
            message: 'هل أنت متأكد من حذف هذه المادة؟',
            warning: 'حذف هذه المادة قد يؤدي لحذف البيانات المرتبطة بها'
        });
        if (confirmed) {
            deleteMutation.mutate([id]);
        }
    };

    if (isLoadingSubjects || isLoadingAssigned || userIsLoading) {
        return (
            <div className={styles.container}>
                <LoadingScreen/>
            </div>
        );
    }

    const pickerTitle = title || config.title || `المواد المعينة للصف ${grade?.name} ${language}`;
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
                                        <IconButton onClick={() => setEditor({mode: 'edit', subject})}>
                                            <EditIcon sx={{color: 'var(--color-focus)'}}/>
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
                    onClick={() => setEditor({mode: 'create', subject: null})}
                    sx={{width: 'fit-content'}}
                >
                    {buttonText}
                </Button>
            </div>

            {editor && (
                <SubjectGradingModal
                    key={`${editor.mode}-${editor.subject?.id ?? 'new'}`}
                    open={!!editor}
                    mode={editor.mode}
                    subject={editor.subject}
                    subjects={subjects}
                    formatItemOption={formatItemOption}
                    onCancel={closeEditor}
                    onSave={handleSave}
                    isLoading={mutation.isLoading || updateMutation.isLoading}
                />
            )}
        </div>
    );
}
