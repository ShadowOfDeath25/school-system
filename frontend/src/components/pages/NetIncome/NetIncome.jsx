import Page from "@ui/Page/Page.jsx";
import PeriodPicker from "@ui/PeriodPicker/PeriodPicker.jsx";
import { useState } from "react";
import IncomeSummary from "@ui/IncomeSummary/IncomeSummary.jsx";

export default function NetIncome() {
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    return (
        <Page>
            <PeriodPicker
                onSubmit={(data) => {
                    setStartDate(data.startDate);
                    setEndDate(data.endDate);
                }}
            />
            <IncomeSummary startDate={startDate} endDate={endDate} />
        </Page>
    );
}

