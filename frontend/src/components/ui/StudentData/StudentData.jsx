import { useMemo } from 'react';
import styles from './styles.module.css';
import SelectField from "@ui/SelectField/SelectField.jsx";
import { useGetAll, useUpdate } from "@hooks/api/useCrud.js";
import { useQueryClient } from "@tanstack/react-query";
import Button from "@mui/material/Button";
import axiosClient from "../../../axiosClient.js";
import { usePDFPreview } from "@contexts/PDFPreviewContext.jsx";
import { useSnackbar } from "@contexts/SnackbarContext.jsx";
import { useInputModal } from "@contexts/InputModalContext.jsx";

export default function StudentData({student, academicYear, setAcademicYear}) {
    const queryClient = useQueryClient();
    const { showInputModal, hideInputModal } = useInputModal();

    const {data: academicYears = []} = useGetAll('academic-years', {}, {
        select: (data) => data?.data?.map((academicYear) => academicYear.name)
    });

    const { data: classroomsData } = useGetAll('classrooms', { all: "true" });
    const updateStudentMutation = useUpdate('students');

    const { showPDFPreview } = usePDFPreview();
    const { showSnackbar } = useSnackbar();

    const currentClassroomId = student?.classroom_id ?? student?.classroom?.id;
    const studentGrade = student?.classroom?.grade ?? student?.grade;
    const studentLanguage = student?.language;
    const studentAcademicYear = student?.classroom?.academic_year || academicYear;

    const candidateClassrooms = useMemo(() => {
        if (!classroomsData?.data) return [];

        return classroomsData.data.filter((c) => {
            // Must match academic year
            if (studentAcademicYear && c.academic_year !== studentAcademicYear) {
                return false;
            }
            // Must match grade
            if (studentGrade && String(c.grade) !== String(studentGrade)) {
                return false;
            }
            // Must match language
            if (studentLanguage && c.language !== studentLanguage) {
                return false;
            }
            // Must not be the student's current classroom
            if (currentClassroomId && c.id === currentClassroomId) {
                return false;
            }
            // Must not be full
            const currentCapacity = c.capacity ?? 0;
            if (c.max_capacity && currentCapacity >= c.max_capacity) {
                return false;
            }

            return true;
        });
    }, [classroomsData, studentGrade, studentLanguage, currentClassroomId, studentAcademicYear]);

    const handleMoveClassroom = () => {
        if (candidateClassrooms.length === 0) {
            showSnackbar('لا توجد فصول متاحة للنقل في نفس الصف واللغة (الفصول إما ممتلئة بالكامل أو غير متوفرة)', 'warning');
            return;
        }

        showInputModal({
            fields: [
                {
                    title: "نقل الطالب إلى فصل آخر",
                    fields: [
                        {
                            name: "current_classroom",
                            type: "select",
                            label: "الفصل الحالي",
                            disabled: true,
                            options: [
                                {
                                    label: student?.classroom?.name || "غير مقيد",
                                    value: currentClassroomId || "current",
                                },
                            ],
                            value: currentClassroomId || "current",
                        },
                        {
                            name: "classroom_id",
                            type: "select",
                            label: "الفصل الجديد",
                            placeholder: "اختر الفصل الجديد",
                            required: true,
                            options: candidateClassrooms.map((c) => ({
                                label: `${c.name} (الكثافة: ${c.capacity ?? 0}/${c.max_capacity})`,
                                value: c.id,
                            })),
                        },
                    ],
                },
            ],
            item: {
                id: student.id,
                current_classroom: currentClassroomId || "current",
            },
            buttonText: "تأكيد النقل",
            isLoading: updateStudentMutation.isPending,
            onSave: (payload) => {
                updateStudentMutation.mutate(
                    {
                        id: student.id,
                        classroom_id: payload.classroom_id,
                    },
                    {
                        onSuccess: () => {
                            queryClient.invalidateQueries({ queryKey: ['classrooms'] });
                            queryClient.invalidateQueries({ queryKey: ['students'] });
                            showSnackbar('تم نقل الطالب إلى الفصل بنجاح');
                            hideInputModal();
                        },
                        onError: (error) => {
                            const message =
                                error?.response?.data?.message ||
                                error?.response?.data?.errors?.classroom_id?.[0] ||
                                'حدث خطأ أثناء نقل الطالب';
                            showSnackbar(message, 'error');
                        },
                    }
                );
            },
        });
    };

    const handlePrintIdCard = async () => {
        try {
            const response = await axiosClient.get('/reports/students/id-cards', {
                params: {
                    student_id: student.id,
                    academic_year: academicYear,
                    layout: 'single',
                }
            });
            showPDFPreview({ url: response.data.preview_url });
        } catch (error) {
            showSnackbar('فشل طباعة بطاقة الهوية', 'error');
        }
    };

    return (
        <>
            <div className={styles.container}>
                <h4 className={styles.title}>بيانات التلميذ</h4>
                <table>
                    <tbody>
                        <tr>
                            <td className={styles.label}>الاسم</td>
                            <td colSpan={3}>{student?.name_in_arabic}</td>
                        </tr>
                        <tr>
                            <td className={styles.label}>رقم القيد</td>
                            <td>{student?.id}</td>
                            <td className={styles.label}>تاريخ الانضمام</td>
                            <td>{student?.joined_at}</td>

                        </tr>
                        <tr>
                            <td className={styles.label}>العام الدراسي</td>
                            <td>
                                <SelectField
                                    options={academicYears}
                                    value={academicYear}
                                    handleChange={(e) => setAcademicYear(e.target.value)}
                                />
                            </td>
                            <td className={styles.label}>اللغة</td>
                            <td>{student.language}</td>
                        </tr>
                        <tr>
                            <td className={styles.label}>المرحلة</td>
                            <td>{student?.classroom?.level}</td>
                            <td className={styles.label}>الصف</td>
                            <td>{student?.classroom?.grade}</td>
                        </tr>
                        <tr>
                            <td className={styles.label}>الفصل المدرسي</td>
                            <td>{student?.classroom?.name}</td>
                            <td className={styles.label}>حالة القيد</td>
                            <td>{student?.status}</td>
                        </tr>
                        <tr>
                            <td className={styles.label}>اشقاء</td>
                            <td>{student?.has_siblings}</td>
                            <td className={styles.label}>علامة مميزة</td>
                            <td>{student?.note}</td>
                        </tr>

                    </tbody>
                </table>
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={handleMoveClassroom}
                        disabled={!currentClassroomId}
                    >
                        نقل إلى فصل آخر
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handlePrintIdCard}
                    >
                        طباعة بطاقة الهوية
                    </Button>
                </div>
            </div>
        </>
    );
}

