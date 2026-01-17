import React, {forwardRef} from 'react';
import {PaymentHelper} from "@helpers/PaymentHelper";
import styles from './Invoice.module.css';
import ReportsHeader from "@reports/ReportsHeader/ReportsHeader.jsx";

export const InvoicePDF = forwardRef(({payment, student, academicYear, summaryData, recipientName}, ref) => {
    const formattedAmount = PaymentHelper.formatCurrency(payment.value);
    const amountInWords = PaymentHelper.numberToArabicWords(payment.value);

    const nationalId = student.nid || "--------------";
    const studentId = student.id || "----";
    const currentYear = academicYear || "2025 - 2026";

    return (
        <div ref={ref} className={styles.page}>
            <div className={styles.container}>
                <ReportsHeader/>
                <div className={styles.doubleLine}/>

                <div className={styles.titleContainer}>
                    <span className={styles.mainTitle}>المصروفات الدراسية</span>
                    <span className={styles.subTitle}>العام الدراسي {currentYear}</span>
                </div>

                <div className={styles.studentIdBox}>
                    <div className={styles.studentIdCell} style={{borderLeft: 'none'}}>
                        <span className={styles.cellLabel}>رقم القيد</span>
                        <span className={styles.cellValue}>{studentId}</span>
                    </div>
                    <div className={styles.studentIdCell}>
                        <span className={styles.cellLabel}>الرقم القومي</span>
                        <span className={styles.cellValue}>{nationalId}</span>
                    </div>
                </div>

                <div className={styles.receiptBody}>
                    <span className={styles.label} style={{textAlign: 'right', marginBottom: '3px'}}>وصل من ولي امر التلميذ:</span>
                    <span className={styles.amountText}
                          style={{textAlign: 'center', marginBottom: '3px'}}>{student.name_in_arabic || "---"}</span>

                    <span className={styles.valueText} style={{
                        textAlign: 'center',
                        marginBottom: '8px',
                        fontSize: '11pt',
                        fontWeight: 'bold'
                    }}>{student.name}</span>

                    <span className={styles.label} style={{textAlign: 'right', marginBottom: '3px'}}>مبلغ وقدره:</span>
                    <span className={styles.amountText}>{amountInWords}</span>
                </div>

                <div className={styles.detailsTable}>
                    <div className={styles.tableRow}>
                        <span className={`${styles.tableHeaderCell} ${styles.noBorderLeft}`}>الفصل</span>
                        <span className={styles.tableHeaderCell}>الفرقة (الصف)</span>
                        <span className={styles.tableHeaderCell}>المرحلة</span>
                    </div>
                    <div className={styles.tableRowLast}>
                        <span
                            className={`${styles.tableCell} ${styles.noBorderLeft}`}>{student?.classroom?.name?.match(/\d+\/\d+/ig) || "-"}</span>
                        <span className={styles.tableCell}>{student.classroom?.grade || "-"}</span>
                        <span className={styles.tableCell}>{student.classroom?.level || "-"}</span>
                    </div>
                </div>

                <div className={styles.detailsTable}>
                    <div className={styles.tableRow}>
                        <span className={`${styles.tableHeaderCell} ${styles.noBorderLeft}`}>رقم الإيصال</span>
                        <span className={styles.tableHeaderCell}>التاريخ</span>
                        <span className={styles.tableHeaderCell}>القيمة</span>
                    </div>
                    <div className={styles.tableRowLast}>
                        <span className={`${styles.tableCell} ${styles.noBorderLeft}`}>{payment.id}</span>
                        <span className={styles.tableCell}>{payment.date.replaceAll("-", "/")}</span>
                        <span className={styles.tableCell}>{formattedAmount}</span>
                    </div>
                </div>


                <div className={styles.summaryTable}>
                    <span className={styles.summaryTitle}>ملخص المصروفات الدراسية للعام</span>
                    <div className={styles.summaryRow}>
                        <span
                            className={styles.summaryValue}>{PaymentHelper.formatCurrency(summaryData?.total?.required)}</span>
                        <span className={styles.summaryLabel}>قيمة المصروفات</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span
                            className={styles.summaryValue}>{PaymentHelper.formatCurrency(summaryData?.total?.paid)}</span>
                        <span className={styles.summaryLabel}>إجمالي المدفوعات</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span
                            className={styles.summaryValue}>{PaymentHelper.formatCurrency(summaryData?.total?.exemptions)}</span>
                        <span className={styles.summaryLabel}>إجمالي الإعفاءات</span>
                    </div>
                    <div className={styles.summaryRowLast}>
                        <span
                            className={styles.summaryValue}>{PaymentHelper.formatCurrency(summaryData?.total?.remaining)}</span>
                        <span className={styles.summaryLabel}>المبلغ المتبقي</span>
                    </div>
                </div>


                <div className={styles.footer}>
                    <span className={styles.footerText}>المستلم: </span>
                    <span className={styles.recipientName}>{recipientName || "المسؤول المالي"}</span>
                </div>

                <span className={styles.timestamp}>
                    تاريخ الطباعة: {(() => {
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = String(now.getMonth() + 1).padStart(2, '0');
                    const day = String(now.getDate()).padStart(2, '0');
                    const hours = String(now.getHours()).padStart(2, '0');
                    const minutes = String(now.getMinutes()).padStart(2, '0');
                    const seconds = String(now.getSeconds()).padStart(2, '0');
                    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
                })()}
                </span>

            </div>
        </div>
    );
});

export default InvoicePDF;
