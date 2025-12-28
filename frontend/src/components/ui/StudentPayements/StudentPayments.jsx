import styles from './styles.module.css'
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import {PaymentHelper} from "@helpers/PaymentHelper.js";
import {useGetAll} from "@hooks/api/useCrud.js";

export default function StudentPayments({student, academicYear}) {
    const {data: fees, isLoading} = useGetAll(`students/${student?.id}/payments`, {academic_year: academicYear}, {
        queryKey: ['payments', student.id]
    });
    if (isLoading) {
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
                            {PaymentHelper.formatCurrency(fees?.required[PaymentHelper.PAYMENT_TYPES.ADMINISTRATIVE]+fees?.required[PaymentHelper.PAYMENT_TYPES.WITHDRAWAL])}
                        </td>
                        <td>
                            {PaymentHelper.formatCurrency(fees?.paid[PaymentHelper.PAYMENT_TYPES.ADMINISTRATIVE])}
                        </td>
                        <td>-</td>
                        <td>
                            {PaymentHelper.formatCurrency(fees?.remaining[PaymentHelper.PAYMENT_TYPES.ADMINISTRATIVE] + fees?.remaining[PaymentHelper.PAYMENT_TYPES.WITHDRAWAL])}
                        </td>
                    </tr>
                    <tr>
                        <td className={styles.label}>المصروفات الدراسية</td>
                        <td>
                            {PaymentHelper.formatCurrency(fees?.required[PaymentHelper.PAYMENT_TYPES.TUITION])}
                        </td>
                        <td>
                            {PaymentHelper.formatCurrency(fees?.paid?.[PaymentHelper.PAYMENT_TYPES.TUITION])}
                        </td>
                        <td>{fees?.exemptions?.exemptions}</td>
                        <td>
                            {PaymentHelper.formatCurrency(fees?.remaining[PaymentHelper.PAYMENT_TYPES.TUITION])}
                        </td>

                    </tr>
                    <tr>
                        <td className={styles.label}>مصروفات الكتب</td>
                        <td>
                            {PaymentHelper.formatCurrency(fees?.required[PaymentHelper.PAYMENT_TYPES.BOOKS])}
                        </td>
                        <td>{PaymentHelper.formatCurrency(fees?.paid?.[PaymentHelper.PAYMENT_TYPES.BOOKS]) ?? "-"}</td>
                        <td>-</td>
                        <td>{PaymentHelper.formatCurrency(fees?.remaining[PaymentHelper.PAYMENT_TYPES.BOOKS])}</td>
                    </tr>
                    <tr>
                        <td className={styles.label}>مصروفات الزي</td>
                        <td>
                            {PaymentHelper.formatCurrency(fees?.required[PaymentHelper.PAYMENT_TYPES.UNIFORM])}
                        </td>
                        <td>{PaymentHelper.formatCurrency(fees?.paid?.[PaymentHelper.PAYMENT_TYPES.UNIFORM])}</td>
                        <td>-</td>
                        <td>{PaymentHelper.formatCurrency(fees?.remaining[PaymentHelper.PAYMENT_TYPES.UNIFORM])}</td>
                    </tr>
                    <tr>
                        <td className={styles.label}>مستحقات اضافية</td>
                        <td>
                            {PaymentHelper.formatCurrency(fees?.required[PaymentHelper.PAYMENT_TYPES.EXTRA_DUES])}
                        </td>
                        <td>{PaymentHelper.formatCurrency(fees?.paid?.[PaymentHelper.PAYMENT_TYPES.EXTRA_DUES])}</td>
                        <td>-</td>
                        <td>{PaymentHelper.formatCurrency(fees?.remaining[PaymentHelper.PAYMENT_TYPES.EXTRA_DUES])}</td>
                    </tr>
                    <tr>
                        <td className={styles.label}>الإجمالي</td>
                        <td>
                            {PaymentHelper.formatCurrency(fees?.total?.required)}
                        </td>
                        <td>
                            {PaymentHelper.formatCurrency(fees?.total?.paid)}
                        </td>
                        <td>{PaymentHelper.formatCurrency(fees?.total?.exemptions)}</td>
                        <td>
                            {PaymentHelper.formatCurrency(fees?.total?.remaining)}
                        </td>
                    </tr>
                </tbody>

            </table>
        </div>);
}

