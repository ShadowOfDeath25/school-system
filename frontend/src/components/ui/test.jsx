import React from 'react';
import {Button, Container, Box, Typography, Stack} from '@mui/material';
import {usePDFPreview} from '@contexts/PDFPreviewContext.jsx';
import ArrearsReportPDF from '@reports/ArrearsReport/ArrearsReportPDF';
import InvoicePDF from '@reports/Invoice/InvoicePDF';
import Page from "@ui/Page/Page.jsx";
import axiosClient from "../../axiosClient.js";

export default function TestReports() {

    const apiURL = import.meta.env.VITE_API_BASE_URL;


    const {showPDFPreview} = usePDFPreview()
    const onClick = async () => {
        const response = await axiosClient.post(`${apiURL}/reports/students/letters`, {
            academic_year: "2025/2024",
            letter: "برجاء سداد المتبقي من المصروفات"
        }).then(response => response.data)

        showPDFPreview({url: response.preview_url})
    }
    return (
        <Page>
            <Button
                onClick={onClick}
                variant={"contained"}
            >
                Show Report
            </Button>
        </Page>
    );
}
