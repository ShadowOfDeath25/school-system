import {useGetAll} from "@hooks/api/useCrud.js";
import {PaymentHelper} from "@helpers/PaymentHelper.js";

export const useStudentPayments = (student, academicYear) => {


    const {data: requiredPayments, isLoading: isLoadingRequired} = useGetAll('payment-values', {
        level: student.classroom.level, academicYear, language: student.language
    }, {
        select: PaymentHelper.transformQueryData,
    })


    const {data: paidPayments, isLoading: isLoadingPaid} = useGetAll('payments', {
        student_id: student.id, academicYear
    }, {
        select: PaymentHelper.transformQueryData
    })


    const {data: exemptions, isLoading: isLoadingExemptions} = useGetAll("exemptions", {type: student.note}, {
        select: (data) => {
            if (data?.data === []) return 0;
            return data?.data.reduce((acc, curr) => {
                acc += Number(curr.value);
                return acc;
            }, 0)
        },
        disabled: student.note !== "لا يوجد"
    })


    const {
        data: bookFees, isLoading: isLoadingBooks
    } = useGetAll('book-purchases', {student_id: student.id, "book.academic_year": academicYear}, {
        select: (data) => {
            if (data?.data === []) return 0;
            return data?.data.reduce((acc, curr) => {
                acc += Number(curr.total_price)
                return acc;
            }, 0);
        }
    });


    const {
        data: uniformFees, isLoading: isLoadingUniforms
    } = useGetAll('uniform-purchases', {student_id: student.id, "uniform.academic_year": academicYear},
        {
            select: (data) => {
                if (data?.data === []) return 0;
                return data?.data.reduce((acc, curr) => {
                    acc += Number(curr.total_price);
                    return acc;
                }, 0)
            }
        })
    const required = {
        ...requiredPayments,
        [PaymentHelper.PAYMENT_TYPES.BOOKS]: bookFees,
        [PaymentHelper.PAYMENT_TYPES.UNIFORM]: uniformFees
    }

    const totalRequired = PaymentHelper.getTotal(required)
    const totalPaid = PaymentHelper.getTotal(paidPayments);
    const remaining = {
        [PaymentHelper.PAYMENT_TYPES.ADMINISTRATIVE]:
            requiredPayments?.[PaymentHelper.PAYMENT_TYPES.ADMINISTRATIVE] - (paidPayments?.[PaymentHelper.PAYMENT_TYPES.ADMINISTRATIVE] ?? 0),
        [PaymentHelper.PAYMENT_TYPES.TUITION]:
            requiredPayments?.[PaymentHelper.PAYMENT_TYPES.TUITION] - (exemptions ?? 0) - (paidPayments?.[PaymentHelper.PAYMENT_TYPES.TUITION] ?? 0),
        [PaymentHelper.PAYMENT_TYPES.BOOKS]: bookFees - (paidPayments?.[PaymentHelper.PAYMENT_TYPES.BOOKS] ?? 0),
        [PaymentHelper.PAYMENT_TYPES.UNIFORM]: uniformFees - (paidPayments?.[PaymentHelper.PAYMENT_TYPES.UNIFORM] ?? 0)
    }
    const totalRemaining = PaymentHelper.getTotal(remaining)
    return {
        required: {
            ...required,
            total: totalRequired
        },
        paid: {
            ...paidPayments,
            total: totalPaid
        },
        remaining: {
            ...remaining,
            total: totalRemaining
        },
        exemptions,
        isLoading: isLoadingRequired || isLoadingBooks || isLoadingUniforms || isLoadingExemptions || isLoadingPaid
    }
}
