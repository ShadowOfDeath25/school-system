import React from 'react';
import { Button, Container, Box, Typography, Stack } from '@mui/material';
import { usePDFPreview } from '@contexts/PDFPreviewContext.jsx';
import ArrearsReportPDF from '@reports/ArrearsReport/ArrearsReportPDF';
import InvoicePDF from '@reports/Invoice/InvoicePDF';

export default function TestReports() {
    const { showPDFPreview } = usePDFPreview();

    const mockPayment = {
        id: 12345,
        value: 5000,
        date: '2024-01-10',
        type: 'مصروفات دراسية'
    };

    const mockStudent = {
        id: 'S001',
        name: 'أحمد محمد علي',
        name_in_arabic: 'أحمد محمد علي',
        nid: '12345678901234',
        classroom: {
            name: '1/1',
            grade: 'الأول',
            level: 'الابتدائي'
        }
    };

    const mockSummary = {
        total: {
            required: 8000,
            paid: 5000,
            exemptions: 0,
            remaining: 3000
        }
    };

    const handleShowArrearsReport = () => {
        showPDFPreview({
            title: "تقرير المتأخرات",
            children: <ArrearsReportPDF />
        });
    };

    const handleShowInvoice = () => {
        showPDFPreview({
            title: "إيصال دفع",
            children: (
                <InvoicePDF
                    payment={mockPayment}
                    student={mockStudent}
                    summaryData={mockSummary}
                    recipientName="المسؤول المالي"
                    academicYear="2024 - 2025"
                />
            )
        });
    };

    return (
        <Container>
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                <Typography variant="h4" gutterBottom>اختبار التقارير</Typography>

                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleShowArrearsReport}
                    >
                        عرض تقرير المتأخرات
                    </Button>

                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleShowInvoice}
                    >
                        عرض إيصال الدفع
                    </Button>
                </Stack>
            </Box>
        </Container>
    );
}
