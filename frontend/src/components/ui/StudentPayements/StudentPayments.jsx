import styles from './styles.module.css'
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import {useStudentPayments} from "@hooks/api/useStudentPayments.js";
import {PaymentHelper} from "@helpers/PaymentHelper.js";

export default function StudentPayments({student, academicYear}) {
    const fees  = useStudentPayments(student, academicYear);
    if (fees.isLoading) {
        return (<div className={styles.container}>
            <LoadingScreen/>
        </div>)
    }

    return (

        <div className={styles.container}>
            <h3 className={styles.title}>مدفوعات التلميذ</h3>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>المطلوب</th>
                        <th>المدفوع</th>
                        <th>اعفائات</th>
                        <th>المتبقي</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className={styles.label}>المصروفات الادارية</td>
                        <td>
                            {PaymentHelper.formatCurrency(fees.required[PaymentHelper.PAYMENT_TYPES.ADMINISTRATIVE])}
                        </td>
                        <td>
                            {PaymentHelper.formatCurrency(fees.paid[PaymentHelper.PAYMENT_TYPES.ADMINISTRATIVE])}
                        </td>
                        <td>-</td>
                        <td>
                            {PaymentHelper.formatCurrency(fees.remaining[PaymentHelper.PAYMENT_TYPES.ADMINISTRATIVE])}
                        </td>
                    </tr>
                    <tr>
                        <td className={styles.label}>المصروفات الدراسية</td>
                        <td>
                            {PaymentHelper.formatCurrency(fees.required[PaymentHelper.PAYMENT_TYPES.TUITION])}
                        </td>
                        <td>
                            {PaymentHelper.formatCurrency(fees.paid[PaymentHelper.PAYMENT_TYPES.TUITION])}
                        </td>
                        <td>{fees.exemptions}</td>
                        <td>
                            {PaymentHelper.formatCurrency(fees.remaining[PaymentHelper.PAYMENT_TYPES.TUITION])}
                        </td>

                    </tr>
                    <tr>
                        <td className={styles.label}>مصروفات الكتب</td>
                        <td>
                            {PaymentHelper.formatCurrency(fees.required[PaymentHelper.PAYMENT_TYPES.BOOKS])}
                        </td>
                        <td>{PaymentHelper.formatCurrency(fees.paid[PaymentHelper.PAYMENT_TYPES.BOOKS])}</td>
                        <td>-</td>
                        <td>{PaymentHelper.formatCurrency(fees.remaining[PaymentHelper.PAYMENT_TYPES.BOOKS])}</td>
                    </tr>
                    <tr>
                        <td className={styles.label}>مصروفات الزي</td>
                        <td>
                            {PaymentHelper.formatCurrency(fees.required[PaymentHelper.PAYMENT_TYPES.UNIFORM])}
                        </td>
                        <td>{PaymentHelper.formatCurrency(fees.paid[PaymentHelper.PAYMENT_TYPES.UNIFORM])}</td>
                        <td>-</td>
                        <td>{PaymentHelper.formatCurrency(fees.remaining[PaymentHelper.PAYMENT_TYPES.UNIFORM])}</td>
                    </tr>
                    <tr>
                        <td className={styles.label}>الإجمالي</td>
                        <td>
                            {PaymentHelper.formatCurrency(fees.required.total)}
                        </td>
                        <td>
                            {PaymentHelper.formatCurrency(fees.paid.total)}
                        </td>
                        <td>{PaymentHelper.formatCurrency(fees.exemptions)}</td>
                        <td>
                            {PaymentHelper.formatCurrency(fees.remaining.total)}
                        </td>
                    </tr>
                </tbody>

            </table>
        </div>);
}

