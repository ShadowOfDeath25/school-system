const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
const FIELDS = {
    SIZE: {
        name: "size", required: true, type: "text", placeholder: "المقاس", label: "المقاس"
    }, TYPE: {
        name: "type", label: "نوع الزي", type: "text", required: true, placeholder: "نوع الزي"
    }, BUY_PRICE: {
        name: "buy_price", label: "سعر الشراء", type: "number", required: true, placeholder: "سعر الشراء"
    }, SELL_PRICE: {
        name: "sell_price", label: "سعر البيع", type: "number", required: true, placeholder: "سعر البيع"
    }, IMPORTED_QUANTITY: {
        name: "imported_quantity", label: "الكمية الواردة", type: "number", required: true, placeholder: "السعر"
    },
}
export const UniformHelper = {
    SIZES, FIELDS
}
