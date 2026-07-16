import Page from "@ui/Page/Page.jsx";
import Filters from "@ui/Filters/Filters.jsx";
import Table from "@ui/Table/Table.jsx";
import SelectField from "@ui/SelectField/SelectField.jsx";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useState } from "react";
import styles from './styles.module.css';
import { useQueryClient } from "@tanstack/react-query";
import { useGetAll } from "@hooks/api/useCrud.js";
import { useSnackbar } from "@contexts/SnackbarContext.jsx";
import { ClassroomHelper } from "@helpers/ClassroomHelper.js";
import { SeatNumberHelper } from "@helpers/SeatNumberHelper.js";
import axiosClient from "../../../axiosClient.js"

export default function ViewSeatAssignments() {
    const [filters, setFilters] = useState({});
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
    const { showSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    const { data: academicYears = [] } = useGetAll('academic-years', {}, {
        select: (data) => data?.data?.map((academicYear) => academicYear.name)
    });

    const filterFields = [
        { ...ClassroomHelper.FIELDS.ACADEMIC_YEAR, options: academicYears },
        ClassroomHelper.FIELDS.LEVEL,
        ClassroomHelper.FIELDS.GRADE,
        { ...ClassroomHelper.FIELDS.LANGUAGE, type: "select" },
    ];

    const tableFields = [
        SeatNumberHelper.FIELDS.STUDENT_NAME,
        SeatNumberHelper.FIELDS.SEAT_NUMBER,
        { name: "academic_year", label: "العام الدراسي" },
        { name: "level", label: "المرحلة" },
        { name: "grade", label: "الصف" },
        { name: "language", label: "اللغة" },
    ];

    const handleAssign = () => {
        setSelectedAcademicYear('');
        setAssignModalOpen(true);
    };

    const handleConfirmAssign = async () => {
        if (!selectedAcademicYear) {
            showSnackbar('يرجى اختيار العام الدراسي', 'error');
            return;
        }

        setAssignModalOpen(false);

        try {
            const response = await axiosClient.post('/seat-numbers/assign', {
                academic_year: selectedAcademicYear,
                level: filters?.level,
                grade: filters?.grade,
                language: filters?.language,
            });
            showSnackbar(response.data.message);
            queryClient.invalidateQueries({ queryKey: ['seat-numbers/assignments'] });
        } catch (error) {
            const data = error.response?.data;
            if (data?.errors?.length) {
                const errorMessages = data.errors.map((e) => e.message).join(' | ');
                showSnackbar(errorMessages, 'error');
            } else {
                showSnackbar(data?.message || 'حدث خطأ أثناء التوزيع', 'error');
            }
        }
    };

    return (
        <Page>
            <Filters
                resource={'seat-numbers'}
                onSubmit={(f) => setFilters(f)}
                fields={filterFields}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
                <Button variant="contained" color="primary" onClick={handleAssign}>
                    توزيع أرقام الجلوس
                </Button>
            </div>
            <Dialog
                open={assignModalOpen}
                onClose={() => setAssignModalOpen(false)}
                className={"seatAssignmentModal"}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle className={styles.title}>اختيار العام الدراسي</DialogTitle>
                <DialogContent className={styles.content}>
                    <SelectField
                        name="academic_year"
                        label="العام الدراسي"
                        placeholder="اختر العام الدراسي"
                        value={selectedAcademicYear}
                        handleChange={(e) => setSelectedAcademicYear(e.target.value)}
                        options={academicYears}
                        isModal
                    />
                </DialogContent>
                <DialogActions className={styles.actions}>
                    <Button onClick={() => setAssignModalOpen(false)} sx={{color: 'var(--primary-text-color)'}}>إلغاء</Button>
                    <Button onClick={handleConfirmAssign} variant="contained" color="primary">تأكيد</Button>
                </DialogActions>
            </Dialog>
            <Table
                resource={'seat-numbers/assignments'}
                filters={filters}
                fields={tableFields}
                editable={false}
                deletable={false}
            />
        </Page>
    );
}
