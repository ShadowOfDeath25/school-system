import Page from "@ui/Page/Page.jsx";
import PeriodPicker from "@ui/PeriodPicker/PeriodPicker.jsx";
import { useState } from "react";
import IncomeSummary from "@ui/IncomeSummary/IncomeSummary.jsx";
import axiosClient from "../../../axiosClient.js";
import { usePDFPreview } from "@contexts/PDFPreviewContext.jsx";

export default function NetIncome() {
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const { showPDFPreview } = usePDFPreview();
    const handlePrint = async (data) => {
        setStartDate(data.startDate);
        setEndDate(data.endDate);
        const response = await axiosClient.get("/reports/financial/summary/print", {
            params: {
                start_date: data.startDate,
                end_date: data.endDate
            }
        });
        showPDFPreview({ url: response.data.preview_url });

    }
    return (
        <Page>
            <PeriodPicker
                onSubmit={(data) => {
                    setStartDate(data.startDate);
                    setEndDate(data.endDate);
                }}
                onPrint={handlePrint}
            />
            <IncomeSummary startDate={startDate} endDate={endDate} />
        </Page>
    );
}

