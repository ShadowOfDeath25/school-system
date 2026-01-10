export const PaymentHelper = {
    PAYMENT_TYPES: {
        ADMINISTRATIVE: "مصروفات ادارية",
        TUITION: "مصروفات دراسية",
        BOOKS: "مصروفات الكتب",
        UNIFORM: "مصروفات الزي",
        EXTRA_DUES: "مستحقات اضافية",
        WITHDRAWAL: "مصروفات سحب الملف"
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
    },
    numberToArabicWords: (number) => {
        if (isNaN(number)) return "";
        const units = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة"];
        const teens = ["عشرة", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر"];
        const tens = ["", "عشرة", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
        const hundreds = ["", "مائة", "مائتان", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة"];
        const thousands = ["", "ألف", "ألفان", "ثلاثة آلاف", "أربعة آلاف", "خمسة آلاف", "ستة آلاف", "سبعة آلاف", "ثمانية آلاف", "تسعة آلاف"];

        let str = "";
        let n = parseInt(number);

        if (n >= 1000) {
            str += thousands[Math.floor(n / 1000)] + " ";
            n %= 1000;
            if (n > 0) str += "و ";
        }
        if (n >= 100) {
            str += hundreds[Math.floor(n / 100)] + " ";
            n %= 100;
            if (n > 0) str += "و ";
        }
        if (n >= 20) {
            const unit = n % 10;
            if (unit > 0) {
                str += units[unit] + " و ";
            }
            str += tens[Math.floor(n / 10)] + " ";
        } else if (n >= 10) {
            str += teens[n - 10] + " ";
        } else if (n > 0) {
            str += units[n] + " ";
        }

        return str.trim() + " جنيه فقط لا غير";
    }
}
