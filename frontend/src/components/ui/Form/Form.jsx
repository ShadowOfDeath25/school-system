import InputField from "@ui/InputField/InputField.jsx";
import SelectField from "@ui/SelectField/SelectField.jsx";
import styles from './styles.module.css'
import RadioField from "@ui/RadioField/RadioField.jsx";
import useForm from "@hooks/useForm.js";
import {useMemo} from "react";
// import DatePicker from '@ui/DatePicker/DatePicker.jsx'

export default function Form({fields, id, title, btnText = "إضافة", onFormSubmit, serverErrors, isModal = false}) {
    const isSectioned = fields.length > 0 && fields[0].hasOwnProperty('fields');

    const allFields = useMemo(
        () => isSectioned ? fields.flatMap(section => section.fields) : fields,
        [fields]
    );

    const initialValues = useMemo(() =>
        allFields.reduce((acc, field) => {
            acc[field.name] = field.value ?? (field.multiple ? [] : "");
            return acc;
        }, {}), [allFields]);

    const {
        formData, errors, touched, handleChange, handleBlur, handleSubmit
    } = useForm({
        initialValues, fields: allFields, onSubmit: onFormSubmit, serverErrors
    });

    const hasEmptyRequiredFields = allFields.some(field => {
        if (field.required === false) return false;
        const value = formData[field.name];
        if (Array.isArray(value)) {
            return value.length === 0;
        }
        return value === '' || value === null || value === undefined;
    });

    const isFormInvalid = Object.values(errors).some(error => error);
    const isButtonDisabled = isFormInvalid || hasEmptyRequiredFields;

    const renderField = (field) => {
        const fieldError = errors[field.name];
        const isTouched = touched[field.name];
        const commonProps = {
            ...field,
            value: formData[field.name],
            handleChange: handleChange,
            handleBlur: handleBlur,
            error: fieldError,
            isValid: isTouched ? !fieldError : undefined,
            isModal: isModal
        };
        switch (field.type) {
            case 'select':
                return <SelectField key={field.id || field.name} {...commonProps} />;
            case 'radio':
                return <RadioField key={field.id || field.name} {...commonProps} />;
            default:
                return <InputField key={field.id || field.name} {...commonProps} />;
        }

    };

    return (<form className={`${isModal ? styles.modalForm : styles.form}`} id={id} onSubmit={handleSubmit}>
        {title && <h3 className={styles.formTitle}>{title}</h3>}
        {isSectioned ? (fields.map((section, index) => (<div key={index} className={styles.formSection}>
            {section.title && <h4 className={styles.sectionTitle}>{section.title}</h4>}
            <div className={`${isModal ? styles.modalInputs : styles.formInputs}`}>
                {section.fields.map(renderField)}
            </div>
        </div>))) : (<div className={`${isModal ? styles.modalInputs : styles.formInputs}`}>
            {fields.map(renderField)}
        </div>)}
        {!isModal && <button type="submit" disabled={isButtonDisabled}>{btnText}</button>}
    </form>);
}
