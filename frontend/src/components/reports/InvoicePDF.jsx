import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { PaymentHelper } from "@helpers/PaymentHelper";
import font from '@fonts/Readex_Pro/ReadexPro-VariableFont_HEXP,wght.ttf';


Font.register({
    family: 'ReadexPro',
    src: font
});

const styles = StyleSheet.create({
    page: {
        fontFamily: 'ReadexPro',
        paddingVertical: 10,
        paddingHorizontal: 5,
        fontSize: 10,
        backgroundColor: '#ffffff',
    },
    container: {
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center'
    },
    headerContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingBottom: 5,
        gap: 10
    },
    logo: {
        width: 40,
        height: 40,
        backgroundColor: '#eee',
        borderRadius: 20
    },
    headerTextContainer: {
        alignItems: 'flex-end'
    },
    headerText: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 2
    },
    headerSubText: {
        fontSize: 9,
        color: '#333'
    },
    doubleLine: {
        width: '100%',
        height: 2,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000',
        marginBottom: 10
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
        width: '100%',
        paddingVertical: 4
    },
    mainTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 2
    },
    subTitle: {
        fontSize: 10
    },
    studentIdBox: {
        width: '100%',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#000',
        marginBottom: 15
    },
    studentIdCell: {
        flex: 1,
        alignItems: 'center',
        padding: 4,
        borderRightWidth: 1,
        borderRightColor: '#000'
    },
    studentIdCellLast: {
        flex: 1,
        alignItems: 'center',
        padding: 4
    },
    cellLabel: {
        fontSize: 9,
        marginBottom: 2,
        color: '#444'
    },
    cellValue: {
        fontSize: 10,
        fontWeight: 'bold'
    },
    receiptBody: {
        width: '100%',
        marginBottom: 10
    },
    lineItem: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 6,
        flexWrap: 'wrap',
        gap: 5
    },
    label: {
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 5
    },
    valueText: {
        fontSize: 11,
        flex: 1,
        textAlign: 'right'
    },
    amountText: {
        fontSize: 11,
        fontWeight: 'bold',
        textAlign: 'center',
        width: '100%',
        marginVertical: 5
    },
    detailsTable: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#000',
        marginBottom: 10
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000'
    },
    tableRowLast: {
        flexDirection: 'row'
    },
    tableHeaderCell: {
        flex: 1,
        padding: 4,
        backgroundColor: '#e6e6e6',
        textAlign: 'center',
        fontSize: 9,
        fontWeight: 'bold',
        borderRightWidth: 1,
        borderRightColor: '#000'
    },
    tableCell: {
        flex: 1,
        padding: 4,
        textAlign: 'center',
        fontSize: 10,
        borderRightWidth: 1,
        borderRightColor: '#000'
    },
    noBorderRight: {
        borderRightWidth: 0
    },
    summaryTable: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#000',
        marginTop: 10,
        marginBottom: 20
    },
    summaryTitle: {
        backgroundColor: '#e6e6e6',
        textAlign: 'center',
        padding: 3,
        fontSize: 9,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderBottomColor: '#000'
    },
    summaryRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    summaryRowLast: {
        flexDirection: 'row',
    },
    summaryLabel: {
        flex: 1,
        padding: 3,
        textAlign: 'right',
        fontSize: 9,
        paddingRight: 5,
        backgroundColor: '#f9f9f9',
        borderRightWidth: 1,
        borderRightColor: '#000'
    },
    summaryValue: {
        flex: 0.5,
        padding: 3,
        textAlign: 'center',
        fontSize: 9,
    },
    footer: {
        width: '100%',
        alignItems: 'flex-end',
        paddingRight: 10
    },
    footerText: {
        fontSize: 10,
        marginBottom: 5,
        direction: "rlt"
    },
    timestamp: {
        marginTop: 15,
        fontSize: 8,
        color: '#666',
        textAlign: 'center',
        width: '100%'
    }
});

export const InvoicePDF = ({ payment, student, logo, academicYear, summaryData, recipientName }) => {
    const formattedAmount = PaymentHelper.formatCurrency(payment.value);
    const amountInWords = PaymentHelper.numberToArabicWords(payment.value);

    const nationalId = student.nid || "--------------";
    const studentId = student.id || "----";
    const currentYear = academicYear || "2025 - 2026";



    return (
        <Document>
            <Page size={[227, 650]} style={styles.page}>
                <View style={styles.container}>
                    <View style={styles.headerContainer}>

                        <View style={{ alignItems: 'center' }}>
                            {logo ?
                                <Image src={logo} style={styles.logo} /> :
                                <View style={styles.logo} />
                            }
                        </View>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerText}>محافظة القليوبية</Text>
                            <Text style={styles.headerText}>إدارة الخصوص التعليمية</Text>
                            <Text style={styles.headerText}>مدرسة التربية الحديثة الخاصة</Text>
                            <Text style={styles.headerSubText}>إدارة الحسابات</Text>
                        </View>
                    </View>
                    <View style={styles.doubleLine} />


                    <View style={styles.titleContainer}>
                        <Text style={styles.mainTitle}>المصروفات الدراسية</Text>
                        <Text style={styles.subTitle}>العام الدراسي {currentYear}</Text>
                    </View>


                    <View style={styles.studentIdBox}>
                        <View style={styles.studentIdCell}>
                            <Text style={styles.cellLabel}>رقم القيد</Text>
                            <Text style={styles.cellValue}>{studentId}</Text>
                        </View>
                        <View style={styles.studentIdCellLast}>
                            <Text style={styles.cellLabel}>الرقم القومي</Text>
                            <Text style={styles.cellValue}>{nationalId}</Text>
                        </View>
                    </View>


                    <View style={styles.receiptBody}>
                        <Text style={[styles.label, { textAlign: 'right', marginBottom: 3 }]}>وصل من ولي امر
                            التلميذ:</Text>
                        <Text style={[styles.amountText, {
                            textAlign: 'center',
                            marginBottom: 3
                        }]}>{student.name_in_arabic || "---"}</Text>

                        <Text style={[styles.valueText, {
                            textAlign: 'center',
                            marginBottom: 8,
                            fontSize: 11,
                            fontWeight: 'bold'
                        }]}>{student.name}</Text>

                        <Text style={[styles.label, { textAlign: 'right', marginBottom: 3 }]}>مبلغ وقدره:</Text>
                        <Text style={styles.amountText}>{amountInWords}</Text>
                    </View>


                    <View style={styles.detailsTable}>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableHeaderCell, styles.noBorderRight]}>الفصل</Text>
                            <Text style={styles.tableHeaderCell}>الفرقة (الصف)</Text>
                            <Text style={styles.tableHeaderCell}>المرحلة</Text>
                        </View>
                        <View style={styles.tableRowLast}>
                            <Text
                                style={[styles.tableCell, styles.noBorderRight]}>{student?.classroom?.name?.match(/\d+\/\d+/ig) || "-"}</Text>
                            <Text style={styles.tableCell}>{student.classroom?.grade || "-"}</Text>
                            <Text style={styles.tableCell}>{student.classroom?.level || "-"}</Text>
                        </View>
                    </View>


                    <View style={styles.detailsTable}>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableHeaderCell, styles.noBorderRight]}>رقم الإيصال</Text>
                            <Text style={styles.tableHeaderCell}>التاريخ</Text>
                            <Text style={styles.tableHeaderCell}>القيمة</Text>
                        </View>
                        <View style={styles.tableRowLast}>
                            <Text style={[styles.tableCell, styles.noBorderRight]}>{payment.id}</Text>
                            <Text style={styles.tableCell}>{payment.date.replaceAll("-", "/")}</Text>
                            <Text style={styles.tableCell}>{formattedAmount}</Text>
                        </View>
                    </View>

                    {/* Summary Box */}
                    <View style={styles.summaryTable}>
                        <Text style={styles.summaryTitle}>ملخص المصروفات الدراسية للعام</Text>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryValue}>{PaymentHelper.formatCurrency(summaryData?.total?.required)}</Text>
                            <Text style={styles.summaryLabel}>قيمة المصروفات</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryValue}>{PaymentHelper.formatCurrency(summaryData?.total?.paid)}</Text>
                            <Text style={styles.summaryLabel}>إجمالي المدفوعات</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryValue}>{PaymentHelper.formatCurrency(summaryData?.total?.exemptions)}</Text>
                            <Text style={styles.summaryLabel}>إجمالي الإعفاءات</Text>
                        </View>
                        <View style={styles.summaryRowLast}>
                            <Text style={styles.summaryValue}>{PaymentHelper.formatCurrency(summaryData?.total?.remaining)}</Text>
                            <Text style={styles.summaryLabel}>المبلغ المتبقي</Text>
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>المستلم:</Text>
                        <Text
                            style={[styles.footerText, { fontWeight: 'bold' }]}>{recipientName || "المسؤول المالي"}</Text>
                    </View>

                    <Text style={styles.timestamp}>
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
                    </Text>

                </View>
            </Page>
        </Document>
    );
};

export default InvoicePDF;
