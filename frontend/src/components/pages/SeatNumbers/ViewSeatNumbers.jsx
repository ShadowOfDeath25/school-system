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
import { useSnackbar } from "@contexts/SnackbarContext.jsx";
import { ClassroomHelper } from "@helpers/ClassroomHelper.js";
import axiosClient from "../../../axiosClient.js"

export default function ViewSeatNumbers() {
    const [filters, setFilters] = useState();
    const [redistributeModalOpen, setRedistributeModalOpen] = useState(false);
    const [redistributeRow, setRedistributeRow] = useState(null);
    const [redistributeSorting, setRedistributeSorting] = useState('');
    const { showSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    const filterFields = [
        {
            ...ClassroomHelper.FIELDS.LANGUAGE,
            type: "select"
        },
        ClassroomHelper.FIELDS.LEVEL,
        ClassroomHelper.FIELDS.GRADE
    ]

    const redistributeAction = {
        header: "إجراءات",
        content: (row) => (
            <Button
                variant="contained"
                size="small"
                sx={{
                    backgroundColor: 'var(--secondary-color)',
                    '&:hover': { backgroundColor: 'var(--secondary-color)', opacity: 0.9 }
                }}
                onClick={() => handleRedistributeClick(row)}
            >
                اعادة توزيع
            </Button>
        ),
    };

    const handleRedistributeClick = (row) => {
        setRedistributeRow(row);
        setRedistributeSorting('');
        setRedistributeModalOpen(true);
    };

    const handleConfirmRedistribute = async () => {
        if (!redistributeRow) return;

        setRedistributeModalOpen(false);

        try {
            const response = await axiosClient.post('/seat-numbers/assign', {
                academic_year: redistributeRow.academic_year,
                level: redistributeRow.level,
                grade: redistributeRow.grade_value,
                language: redistributeRow.language,
                sorting: redistributeSorting || undefined,
                redistribute: true,
            });
            showSnackbar(response.data.message);
            queryClient.invalidateQueries({ queryKey: ['seat-numbers'] });
        } catch (error) {
            const data = error.response?.data;
            if (data?.errors?.length) {
                const errorMessages = data.errors.map((e) => e.message).join(' | ');
                showSnackbar(errorMessages, 'error');
            } else {
                showSnackbar(data?.message || 'حدث خطأ أثناء اعادة التوزيع', 'error');
            }
        }
    };

    return (
        <>
            <Page>
                <Filters
                    resource={'seat-numbers'}
                    onSubmit={(filters) => setFilters(filters)}
                    fields={filterFields}
                />
                <Dialog
                    open={redistributeModalOpen}
                    onClose={() => setRedistributeModalOpen(false)}
                    className={"seatAssignmentModal"}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle className={styles.title}>اعادة توزيع أرقام الجلوس</DialogTitle>
                    <DialogContent className={styles.content}>
                        {redistributeRow && (
                            <div style={{ textAlign: 'center', marginBottom: 10, fontSize: '1.1rem' }}>
                                <p style={{ margin: '5px 0' }}>العام الدراسي: <strong>{redistributeRow.academic_year}</strong></p>
                                <p style={{ margin: '5px 0' }}>المرحلة: <strong>{redistributeRow.level}</strong></p>
                                <p style={{ margin: '5px 0' }}>الصف: <strong>{redistributeRow.grade}</strong></p>
                                <p style={{ margin: '5px 0' }}>اللغة: <strong>{redistributeRow.language}</strong></p>
                            </div>
                        )}
                        <SelectField
                            name="sorting"
                            label="طريقة التوزيع"
                            placeholder="طريقة التوزيع"
                            value={redistributeSorting}
                            handleChange={(e) => setRedistributeSorting(e.target.value)}
                            options={[
                                { label: "الترتيب الأبجدي", value: "alphabetical" },
                                { label: "البنين أولًا", value: "males_first" },
                                { label: "البنات أولًا", value: "females_first" },
                            ]}
                            isModal
                        />
                    </DialogContent>
                    <DialogActions className={styles.actions}>
                        <Button onClick={() => setRedistributeModalOpen(false)} sx={{color: 'var(--btn-ghost-text)'}}>إلغاء</Button>
                        <Button onClick={handleConfirmRedistribute} variant="contained" color="primary">تأكيد</Button>
                    </DialogActions>
                </Dialog>
                <Table
                    resource={'seat-numbers'}
                    filters={filters}
                    editable={false}
                    fields={[
                        { name: "academic_year", label: "العام الدراسي" },
                        { name: "level", label: "المرحلة" },
                        { name: "grade", label: "الصف" },
                        { name: "language", label: "اللغة" },
                        { name: "starts_at", label: "تبدأ من" },
                        { name: "ends_at", label: "تنتهي عند" },
                    ]}
                >
                    {redistributeAction}
                </Table>
            </Page>
        </>
    );
}
