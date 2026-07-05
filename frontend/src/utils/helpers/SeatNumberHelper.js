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
        validator: (endsAt, startsAt) => Number(endsAt) > Number(startsAt),
        error: "هذا الرقم يجب يكون اكبر من رقم البداية"
    },
    STUDENT_NAME: {
        name: "student_name",
        type: "text",
        label: "اسم الطالب",
    },
    SEAT_NUMBER: {
        name: "seat_number",
        type: "number",
        label: "رقم الجلوس",
    },
}

export const SeatNumberHelper = {
    FIELDS
}
