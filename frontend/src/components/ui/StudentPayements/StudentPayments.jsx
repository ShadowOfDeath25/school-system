import styles from './styles.module.css'
import {useGetAll} from "@hooks/api/useCrud.js";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import {PaymentHelper} from "@helpers/PaymentHelper.js";
import {useMemo} from "react";
import {useStudentPayments} from "@hooks/api/useStudentPayments.js";

export default function StudentPayments({student, academicYear}) {

    const {data: requiredPayments, isLoading: isLoadingRequired} = useGetAll('payment-values', {
        level: student.classroom.level, academicYear, language: student.language
    }, {
        select: PaymentHelper.transformQueryData,
    })

    const {
        data: bookPayments, isLoading: isLoadingBooks
    } = useGetAll('book-purchases', {student_id: student.id}, {
        select: PaymentHelper.transformQueryData
    })
    console.log("student payment data: ", useStudentPayments(student, academicYear));

    const {
        data: uniformPayments, isLoading: isLoadingUniform
    } = useGetAll('uniform-purchases', {student_id: student.id}, {
        select: PaymentHelper.transformQueryData
    })


    const {data: paidPayments, isLoading: isLoadingPaid} = useGetAll('payments', {student_id: student.id}, {
        select: PaymentHelper.transformQueryData
    })

    const {
        data: exemptions, isLoading: isLoadingExemptions
    } = useGetAll('exemptions', {type: student.note}, {
        disabled: student.note !== "لا يوجد"
    })


    const totalExemptions = exemptions?.data?.reduce((acc, curr) => {
        acc += Number(curr.value)
        return acc
    }, 0) || 0;

    console.log("books: ", bookPayments);
    console.log("uniforms: ", uniformPayments);

    const diff = useMemo(() => {
        if (!requiredPayments || !paidPayments) return {};
        const value = {};
        Object.keys(requiredPayments).forEach(item => {
            value[item] = paidPayments[item] ? requiredPayments[item] - paidPayments[item] : requiredPayments[item];
        })
        return value;
    }, [requiredPayments, paidPayments]);

    const Loading = isLoadingUniform || isLoadingPaid || isLoadingBooks || isLoadingRequired || isLoadingExemptions
    if (Loading) {
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
                            {isNaN(requiredPayments['مصروفات ادارية']) ? "-" : requiredPayments['مصروفات ادارية']}
                        </td>
                        <td>
                            {isNaN(paidPayments['مصروفات ادارية']) ? "-" : paidPayments['مصروفات ادارية']}
                        </td>
                        <td>-</td>
                        <td>
                            {isNaN(diff['مصروفات ادارية']) ? '-' : diff['مصروفات ادارية']}
                        </td>
                    </tr>
                    <tr>
                        <td className={styles.label}>المصروفات الدراسية</td>
                        <td>
                            {isNaN(requiredPayments['مصروفات دراسية']) ? "-" : requiredPayments['مصروفات دراسية']}
                        </td>
                        <td>
                            {isNaN(paidPayments['مصروفات دراسية']) ? "-" : paidPayments['مصروفات دراسية']}
                        </td>
                        <td>{totalExemptions === 0 ? '-' : totalExemptions}</td>
                        <td>
                            {isNaN(diff['مصروفات دراسية']) ? '-' : diff['مصروفات دراسية'] - totalExemptions}
                        </td>

                    </tr>
                    <tr>
                        <td className={styles.label}>مصروفات الكتب</td>
                        <td>TBD</td>
                        <td>TBD</td>
                        <td>TBD</td>
                        <td>TBD</td>
                    </tr>
                    <tr>
                        <td className={styles.label}>المصاريف الادارية</td>
                        <td>TBD</td>
                        <td>TBD</td>
                        <td>TBD</td>
                        <td>TBD</td>
                    </tr>
                    <tr>
                        <td className={styles.label}>المصاريف الادارية</td>
                        <td>TBD</td>
                        <td>TBD</td>
                        <td>TBD</td>
                        <td>TBD</td>
                    </tr>
                    <tr>
                        <td className={styles.label}>المصاريف الادارية</td>
                        <td>TBD</td>
                        <td>TBD</td>
                        <td>TBD</td>
                        <td>TBD</td>
                    </tr>
                </tbody>

            </table>
        </div>);
}

