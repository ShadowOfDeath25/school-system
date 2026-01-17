import React, {forwardRef} from 'react';
import styles from './ArrearsReport.module.css';
import ReportsHeader from "@reports/ReportsHeader/ReportsHeader.jsx";

const ArrearsReportPDF = forwardRef(({data, metadata, academicYear: academicYearProp}, ref) => {

    const reportData = (data && data.length > 0) ? data : [
        {
            id: 1,
            regId: '4140',
            name: 'آسر عماد أحمد عبدالرحمن',
            value: 8000,
            paid: 5000,
            exemptions: 0,
            remaining: 3000,
            mobile: '0122756117 / 01114262191'
        },
    ];

    const ROWS_PER_PAGE = 15;
    const totalPages = Math.ceil(reportData.length / ROWS_PER_PAGE) || 1;


    const chunkedData = [];
    for (let i = 0; i < totalPages; i++) {
        const start = i * ROWS_PER_PAGE;
        const end = start + ROWS_PER_PAGE;
        const chunk = reportData.slice(start, end);

        const paddedChunk = [...chunk];
        while (paddedChunk.length < ROWS_PER_PAGE) {
            paddedChunk.push({id: `empty-${i}-${paddedChunk.length}`, empty: true});
        }
        chunkedData.push(paddedChunk);
    }

    const totals = reportData.reduce((acc, curr) => ({
        value: acc.value + (curr.value || 0),
        paid: acc.paid + (curr.paid || 0),
        exemptions: acc.exemptions + (curr.exemptions || 0),
        remaining: acc.remaining + (curr.remaining || 0),
    }), {value: 0, paid: 0, exemptions: 0, remaining: 0});

    const info = metadata || {
        academicYear: academicYearProp || '2025 - 2026',
        grade: 'رياض أطفال',
        level: 'الأولى',
        classCode: '1/1_KG',
        capacity: 70,
        actual: 42
    };

    return (
        <div ref={ref}>
            {chunkedData.map((rows, pageIndex) => (
                <div key={pageIndex} className={styles.page}>
                    <ReportsHeader/>
                    <div className={styles.titleContainer}>
                        <span className={styles.mainTitle}>مدفوعات التلاميذ</span>
                        <span style={{fontSize: '11pt', fontWeight: 'bold'}}>"متأخرات المصروفات الدراسية"</span>
                        <div className={styles.subTitleBox}>
                            <span style={{fontWeight: 'bold'}}>{info.academicYear}</span>
                            <span>العام الدراسي</span>
                        </div>
                    </div>


                    <div className={styles.subHeaderTable}>
                        <div className={styles.subHeaderCell} style={{borderRight: 'none'}}>
                            <span className={styles.subHeaderValue}>{info.actual}</span>
                            <span className={styles.subHeaderLabel}>الطاقة الفعلية</span>
                        </div>
                        <div className={styles.subHeaderCell}>
                            <span className={styles.subHeaderValue}>{info.capacity}</span>
                            <span className={styles.subHeaderLabel}>الطاقة الإستيعابية</span>
                        </div>
                        <div className={styles.subHeaderCell}>
                            <span className={styles.subHeaderValue}>{info.level}</span>
                            <span className={styles.subHeaderLabel}>الفرقة</span>
                        </div>
                        <div className={styles.subHeaderCell}>
                            <span className={styles.subHeaderValue}>{info.grade}</span>
                            <span className={styles.subHeaderLabel}>المرحلة</span>
                        </div>
                        <div className={styles.subHeaderCell} style={{borderLeft: 'none'}}>
                            <span className={styles.subHeaderValue}>{info.classCode}</span>
                            <span className={styles.subHeaderLabel}>رمز الفصل</span>
                        </div>
                    </div>


                    <table className={styles.table}>
                        <thead className={styles.tableHeader}>
                            <tr>
                                <th rowSpan="2" className={`${styles.cellMobile}`}>المحمول</th>
                                <th colSpan="4">المصروفات الدراسية - {reportData[0]?.value || 0}</th>
                                <th rowSpan="2" className={`${styles.cellName}`}>اسم التلميذ</th>
                                <th rowSpan="2" className={`${styles.cellRegistration}`}>رقم القيد</th>
                                <th rowSpan="2" className={`${styles.cellM}`} style={{borderLeft: 'none'}}>م</th>
                            </tr>
                            <tr>

                                <th>المتبقي</th>
                                <th>اعفاءات</th>
                                <th>المدفوع</th>
                                <th style={{borderLeft: 'none'}}>القيمة</th>
                            </tr>
                        </thead>

                        <tbody>
                            {rows.map((student, rowIndex) => (
                                <tr key={student.id} className={styles.tableRow}>
                                    {student.empty ? (
                                        <>
                                            <td className={styles.cellMobile}>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td>&nbsp;</td>
                                            <td style={{borderLeft: 'none'}}>&nbsp;</td>
                                            <td className={styles.cellName}>&nbsp;</td>
                                            <td className={styles.cellRegistration}>&nbsp;</td>
                                            <td className={styles.cellM}
                                                style={{borderLeft: 'none'}}>{pageIndex * ROWS_PER_PAGE + rowIndex + 1}</td>
                                        </>
                                    ) : (
                                        <>
                                            <td className={styles.cellMobile}>{student.mobile}</td>
                                            <td>{student.remaining}</td>
                                            <td>{student.exemptions}</td>
                                            <td>{student.paid}</td>
                                            <td style={{borderLeft: 'none'}}>{student.value}</td>
                                            <td className={styles.cellName}>{student.name}</td>
                                            <td className={styles.cellRegistration}>{student.regId}</td>
                                            <td className={styles.cellM}
                                                style={{borderLeft: 'none'}}>{pageIndex * ROWS_PER_PAGE + rowIndex + 1}</td>
                                        </>
                                    )}
                                </tr>
                            ))}

                            {/* Only show totals on the last page */}
                            {pageIndex === totalPages - 1 && (
                                <tr className={`${styles.totalsRow}`}>
                                    <td className={styles.cellMobile}></td>
                                    <td>{totals.remaining}</td>
                                    <td>{totals.exemptions}</td>
                                    <td>{totals.paid}</td>
                                    <td style={{borderLeft: 'none'}}>{totals.value}</td>
                                    <td colSpan="3"
                                        style={{textAlign: 'right', paddingRight: '20px', borderLeft: 'none'}}>الإجمالي
                                        لفصل {info.classCode}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>


                    <div className={styles.footer}>
                        <span
                            className={styles.timestamp}>التاريخ: {new Date().toLocaleDateString('ar-EG')} الساعة {new Date().toLocaleTimeString('ar-EG')}</span>
                        <span className={styles.pageNumber}>( الصفحة {pageIndex + 1} )</span>
                        <span>إجمالي الصفحات: {totalPages}</span>
                    </div>
                </div>
            ))}
        </div>
    );
});

export default ArrearsReportPDF;
