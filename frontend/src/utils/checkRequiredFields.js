export default function checkRequiredFields(data, fields) {
    for (const field of fields) {
        if (field.type === 'age') {
            if (field.required && (!data[`${field.name}_years`] || !data[`${field.name}_months`])) {
                return false;
            }
        } else if (!data[field.name] && field.required) {
            return false;
        }
    }
    return true;
}
