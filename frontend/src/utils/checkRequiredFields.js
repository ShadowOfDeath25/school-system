export default function checkRequiredFields(data, fields) {
    for (const field of fields) {
        if (!data[field.name] && field.required) {
            return false;
        }
    }
    return true;
}
