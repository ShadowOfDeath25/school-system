export const PaymentHelper = {
    PAYMENT_TYPES: {
        ADMINISTRATIVE: "مصروفات ادارية",
        TUITION: "مصروفات دراسية",
        BOOKS: "مصروفات الكتب",
        UNIFORM: "مصروفات الزي"
    },
    formatCurrency: (value) => isNaN(value) ? "-" : value,

    transformQueryData: (data) => {
        const values = {};
        data?.data.forEach(item => {
            values[item.type] = Number(item.value);
        });
        return values;
    }
}
