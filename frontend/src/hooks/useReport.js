import {useMemo, useRef} from "react";
import {useReactToPrint} from "react-to-print";

export const useReport = (ReportComponent, reportProps) => {
    const componentRef = useRef(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: reportProps?.config?.title || 'report',
    })
    const PrintableReport = useMemo(() => {
        return <ReportComponent ref={componentRef} {...reportProps} />;
    }, [ReportComponent,reportProps])
    return handlePrint;
}

