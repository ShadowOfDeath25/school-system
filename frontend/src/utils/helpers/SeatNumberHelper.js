import {validator} from "@utils/validator.js";

const FIELDS = {
    STARTS_AT: {
        name: "starts_at",
        type: "number",
        label: "تبدأ من",
        required: true,
        placeholder: "تبدأ من"
    },
    ENDS_AT: {
        name: "ends_at",
        type: "number",
        label: "تنتهي عند",
        required: true,
        dependency: "starts_at",
        placeholder: "تنتهي عند",
        validator: validator.seatNumbers.ends_at,
        error: "هذا الرقم يجب يكون اكبر من رقم البداية"
    }
}

export const SeatNumberHelper = {
    FIELDS
}
