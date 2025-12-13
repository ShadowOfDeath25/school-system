export const PaymentHelper = {
    PAYMENT_TYPES: {
        ADMINISTRATIVE: "مصروفات ادارية",
        TUITION: "مصروفات دراسية",
        BOOKS: "مصروفات الكتب",
        UNIFORM: "مصروفات الزي",
        EXTRA_DUES: "مستحقات اضافية"
    },
    formatCurrency: (value) => isNaN(value) ? "-" : value,
    getTotal: (data) => {
        let total = 0;
        if (data !== {}) {
            for (let item in data) {
                total += Number(data[item]);
            }
            return total;
        }
        return 0;
    },
    transformQueryData: (data) => {
        const values = {};
        data?.data.forEach(item => {
            values[item.type] = Number(item.value);
        });
        return values;
    }
}
