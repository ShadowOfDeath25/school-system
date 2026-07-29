import { useState } from "react";
import Page from "@ui/Page/Page.jsx";
import PeriodPicker from "@ui/PeriodPicker/PeriodPicker.jsx";
import { usePDFPreview } from "@contexts/PDFPreviewContext.jsx";
import { useSnackbar } from "@contexts/SnackbarContext.jsx";
import { useExport } from "@hooks/useExport.js";
import axiosClient from "../../../axiosClient.js";
import styles from "./report.module.css";

const numberFormatter = new Intl.NumberFormat("ar-EG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const formatAmount = (value) => numberFormatter.format(Number(value ?? 0));

const formatDate = (value) => {
    if (!value) return "—";

    const [year, month, day] = value.slice(0, 10).split("-");
    return `${day}/${month}/${year}`;
};

export default function BankAccountReport() {
    const [reportData, setReportData] = useState(null);
    const { showPDFPreview } = usePDFPreview();
    const { showSnackbar } = useSnackbar();
    const { exportAsExcel } = useExport();

    const getParams = ({ academicYear, startDate, endDate }) => {
        if (!academicYear) {
            showSnackbar("يجب اختيار العام الدراسي", "error");
            return null;
        }

        return {
            academic_year: academicYear,
            start_date: startDate,
            end_date: endDate,
        };
    };

    const handleView = async (selection) => {
        const params = getParams(selection);
        if (!params) return;

        try {
            const response = await axiosClient.get("/reports/financial/bank-accounts", { params });
            setReportData(response.data);
        } catch (error) {
            showSnackbar(error?.response?.data?.message || "فشل تحميل التقرير", "error");
        }
    };

    const handlePrint = async (selection) => {
        const params = getParams(selection);
        if (!params) return;

        try {
            const response = await axiosClient.get("/reports/financial/bank-accounts", {
                params: { ...params, export: "pdf" },
            });
            showPDFPreview({ url: response.data.preview_url });
        } catch (error) {
            showSnackbar(error?.response?.data?.message || "فشل تحميل التقرير", "error");
        }
    };

    const handleExport = (selection) => {
        const params = getParams(selection);
        if (!params) return;

        exportAsExcel("/reports/financial/bank-accounts", params);
    };

    return (
        <Page>
            <PeriodPicker
                onSubmit={handleView}
                onPrint={handlePrint}
                onExport={handleExport}
            />

            {reportData ? (
                <div className={styles.container}>
                    <h4 className={styles.title}>حركات الحسابات البنكية — {reportData.academic_year}</h4>
                    <div className={styles.summaryCards}>
                        <div><span>إجمالي الإيداعات</span><strong>{formatAmount(reportData.totals.deposits)}</strong></div>
                        <div><span>إجمالي المسحوبات</span><strong>{formatAmount(reportData.totals.withdrawals)}</strong></div>
                        <div><span>صافي الخزنة</span><strong>{formatAmount(reportData.totals.treasury_net)}</strong></div>
                        <div className={reportData.totals.net < 0 ? styles.negative : styles.positive}>
                            <span>صافي الحساب</span><strong>{formatAmount(reportData.totals.net)}</strong>
                        </div>
                        <div><span>عدد الحركات</span><strong>{reportData.totals.transactions_count}</strong></div>
                    </div>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>رقم الحركة</th><th>التاريخ</th><th>نوع العملية</th>
                                    <th>الإيداع</th><th>السحب</th><th>اسم المسؤول</th><th>ملاحظات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.transactions.length > 0 ? reportData.transactions.map((transaction) => (
                                    <tr key={transaction.id}>
                                        <td>{transaction.id}</td>
                                        <td>{formatDate(transaction.date)}</td>
                                        <td>{transaction.type}</td>
                                        <td className={styles.deposit}>{transaction.deposit ? formatAmount(transaction.deposit) : "—"}</td>
                                        <td className={styles.withdrawal}>{transaction.withdrawal ? formatAmount(transaction.withdrawal) : "—"}</td>
                                        <td>{transaction.manager_name}</td>
                                        <td>{transaction.notes}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="7" className={styles.empty}>لا توجد حركات</td></tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3">الإجمالي</td>
                                    <td className={styles.deposit}>{formatAmount(reportData.totals.deposits)}</td>
                                    <td className={styles.withdrawal}>{formatAmount(reportData.totals.withdrawals)}</td>
                                    <td colSpan="2">الصافي: {formatAmount(reportData.totals.net)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            ) : null}
        </Page>
    );
}
