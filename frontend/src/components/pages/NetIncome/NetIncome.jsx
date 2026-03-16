import Page from "@ui/Page/Page.jsx";
import PeriodPicker from "@ui/PeriodPicker/PeriodPicker.jsx";
import {useState} from "react";
import IncomeSummary from "@ui/IncomeSummary/IncomeSummary.jsx";
import axiosClient from "../../../axiosClient.js";
import {usePDFPreview} from "@contexts/PDFPreviewContext.jsx";
import {useExport} from "@hooks/useExport.js";

export default function NetIncome() {
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const {showPDFPreview} = usePDFPreview();
    const {exportAsExcel} = useExport()
    const handlePrint = async (data) => {
        setStartDate(data.startDate);
        setEndDate(data.endDate);
        const response = await axiosClient.get("/reports/financial/summary/print", {
            params: {
                start_date: data.startDate,
                end_date: data.endDate
            }
        });
        showPDFPreview({url: response.data.preview_url});

    }
    const handleExport = async (data) => {
        setStartDate(data.startDate);
        setEndDate(data.endDate);
        exportAsExcel("/reports/financial/summary/print", {
                start_date: data.startDate,
                end_date: data.endDate
            }
        )
    }
    return (
        <Page>
            <PeriodPicker
                onSubmit={(data) => {
                    setStartDate(data.startDate);
                    setEndDate(data.endDate);
                }}
                onPrint={handlePrint}
                onExport={handleExport}
            />
            <IncomeSummary startDate={startDate} endDate={endDate}/>
        </Page>
    );
}

