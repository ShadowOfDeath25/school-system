import React from 'react';
import {Button, Container, Box, Typography, Stack} from '@mui/material';
import {usePDFPreview} from '@contexts/PDFPreviewContext.jsx';
import ArrearsReportPDF from '@reports/ArrearsReport/ArrearsReportPDF';
import InvoicePDF from '@reports/Invoice/InvoicePDF';
import Page from "@ui/Page/Page.jsx";

export default function TestReports() {
    const {showPDFPreview} = usePDFPreview();
    const apiURL = import.meta.env.VITE_API_BASE_URL;
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

    // const handleShowArrearsReport = () => {
    //     showPDFPreview({
    //         title: "تقرير المتأخرات",
    //         children: <ArrearsReportPDF/>
    //     });
    // };
    //
    // const handleShowInvoice = () => {
    //     showPDFPreview({
    //         title: "إيصال دفع",
    //         children: (
    //             <InvoicePDF
    //                 payment={mockPayment}
    //                 student={mockStudent}
    //                 summaryData={mockSummary}
    //                 recipientName="المسؤول المالي"
    //                 academicYear="2024 - 2025"
    //             />
    //         )
    //     });
    // };

    return (
        <Page>
            <iframe
                src={apiURL + "/reports/test"}
                style={{width: '100%', height: '100vh', border: 'none'}}
            />
        </Page>
    );
}
