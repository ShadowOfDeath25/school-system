import styles from './styles.module.css'
import SelectField from "@ui/SelectField/SelectField.jsx";
import {ClassroomHelper} from "@helpers/ClassroomHelper.js";
import {useGetAll} from "@hooks/api/useCrud.js";
import Button from "@mui/material/Button";
import BadgeIcon from "@mui/icons-material/Badge";
import axiosClient from "../../../axiosClient.js";
import { usePDFPreview } from "@contexts/PDFPreviewContext.jsx";
import { useSnackbar } from "@contexts/SnackbarContext.jsx";

export default function StudentData({student, academicYear, setAcademicYear}) {
    const {data: academicYears = []} = useGetAll('academic-years', {}, {
        select: (data) => data?.data?.map((academicYear) => academicYear.name)
    });
    
    const { showPDFPreview } = usePDFPreview();
    const { showSnackbar } = useSnackbar();

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

    console.log(student)
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
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<BadgeIcon />}
                        onClick={handlePrintIdCard}
                    >
                        طباعة بطاقة الهوية
                    </Button>
                </div>
            </div>

        </>
    );
}

