import InputField from "@ui/InputField/InputField.jsx";
import SelectField from "@ui/SelectField/SelectField.jsx";
import styles from './styles.module.css'
import RadioField from "@ui/RadioField/RadioField.jsx";
import AgeField from "@ui/AgeField/AgeField.jsx";
import PermissionSelector from "@ui/PermissionSelector/PermissionSelector.jsx";
import useForm from "@hooks/useForm.js";
import { useEffect, useMemo, useRef } from "react";


export default function Form({
    fields,
    id,
    title,
    btnText = "إضافة",
    onFormSubmit,
    serverErrors,
    isModal = false,
    values: externalValues,
    setValues: setExternalValues,
    formStateRef,
    onFormDataChange
}) {
    const isSectioned = fields.length > 0 && fields[0].hasOwnProperty('fields');

    const allFields = useMemo(
        () => isSectioned ? fields.flatMap(section => section.fields) : fields,
        [fields]
    );

    const initialValues = useMemo(() =>
        allFields.reduce((acc, field) => {
            if (field.type === 'age') {
                acc[`${field.name}_years`] = "";
                acc[`${field.name}_months`] = "";
            } else if (field.type === 'permissions') {
                acc[field.name] = field.value ?? [];
            } else {
                acc[field.name] = field.value ?? (field.multiple ? [] : "");
            }
            return acc;
        }, {}), [allFields]);

    const internalForm = useForm({
        initialValues, fields: allFields, onSubmit: onFormSubmit, serverErrors
    });

    const isControlled = externalValues !== undefined && setExternalValues !== undefined;

    const formData = isControlled ? externalValues : internalForm.formData;
    const errors = isControlled ? {} : internalForm.errors;
    const touched = isControlled ? {} : internalForm.touched;
    const handleBlur = isControlled ? () => {
    } : internalForm.handleBlur;
    const handleSubmit = isControlled ? (e) => {
        e.preventDefault();
        if (onFormSubmit) {
            onFormSubmit(formData);
        }
    } : (e) => {
        const visibleFields = allFields.filter(
            f => typeof f.visible !== 'function' || f.visible(formData)
        );
        internalForm.handleSubmit(e, {validateFields: visibleFields});
    };
    const setFieldValue = isControlled ? (name, value) => setExternalValues(prev => ({
        ...prev,
        [name]: value
    })) : internalForm.setFieldValue;

    const handleChange = isControlled ? (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;
        setExternalValues(prev => ({ ...prev, [name]: fieldValue }));
    } : internalForm.handleChange;

    const prevFormDataRef = useRef(formData);
    useEffect(() => {
        if (formStateRef) {
            formStateRef.current = formData;
        }
        if (onFormDataChange) {
            onFormDataChange(formData);
        }

        const prevFormData = prevFormDataRef.current;
        allFields.forEach(field => {
            if (field.type === 'select' && typeof field.options === 'function') {
                const newOptions = field.options(formData);
                const oldOptions = field.options(prevFormData);

                if (JSON.stringify(newOptions) !== JSON.stringify(oldOptions)) {
                    const currentValue = formData[field.name];
                    const hasValue = Array.isArray(currentValue) ? currentValue.length > 0 : !!currentValue;

                    if (hasValue) {
                        const valueExists = newOptions.some(opt => opt.value === currentValue);
                        if (!valueExists) {
                            setFieldValue(field.name, field.multiple ? [] : '');
                        }
                    }
                }
            }
        });

        prevFormDataRef.current = formData;
    }, [formData, allFields, setFieldValue, formStateRef, onFormDataChange]);

    const hasEmptyRequiredFields = allFields.some(field => {
        if (!field.required) return false;
        if (typeof field.visible === 'function' && !field.visible(formData)) return false;
        if (field.type === 'age') {
            const yearsVal = formData[`${field.name}_years`];
            const monthsVal = formData[`${field.name}_months`];
            return yearsVal === '' || yearsVal === null || yearsVal === undefined ||
                   monthsVal === '' || monthsVal === null || monthsVal === undefined;
        }
        const value = formData[field.name];
        if (Array.isArray(value)) {
            return value.length === 0;
        }
        return value === '' || value === null || value === undefined;
    });

    const isFormInvalid = Object.values(errors).some(error => error);
    const isButtonDisabled = (isControlled ? hasEmptyRequiredFields : (isFormInvalid || hasEmptyRequiredFields));

    const renderField = (field) => {
        if (typeof field.visible === 'function' && !field.visible(formData)) return null;
        const fieldError = errors[field.name];
        const isTouched = touched[field.name];
        const commonProps = {
            ...field,
            value: formData[field.name],
            formData: formData,
            formErrors: errors,
            setFieldValue: setFieldValue,
            handleChange: (e) => {
                if (typeof field.handleChange === 'function') field.handleChange(e)
                handleChange(e)
            },
            handleBlur: handleBlur,
            error: fieldError,
            isValid: isTouched ? !fieldError : undefined,
            isModal: isModal,
            options: typeof field.options === 'function'
                ? field.dependency
                    ? Array.isArray(field.dependency)
                        ? field.options(field.dependency.map(d => formData[d]))
                        : field.options(formData[field.dependency])
                    : field.options(formData)
                : field.options,
            disabled: typeof field.disabled === 'function'
                ? field.dependency
                    ? field.disabled(Array.isArray(field.dependency) ? field.dependency.map(d => formData[d]) : formData[field.dependency])
                    : field.disabled(formData)
                : field.disabled,
        };
        switch (field.type) {
            case 'select':
                return <SelectField key={field.id || field.name} {...commonProps} />;
            case 'radio':
                return <RadioField key={field.id || field.name} {...commonProps} />;
            case 'age':
                return <AgeField key={field.id || field.name} {...commonProps} />;
            case 'permissions':
                return (
                    <PermissionSelector
                        key={field.id || field.name}
                        permissions={field.options}
                        value={formData[field.name]}
                        onChange={(value) => setFieldValue(field.name, value)}
                    />
                );
            default:
                return <InputField key={field.id || field.name} {...commonProps} />;
        }

    };

    return (
        <form
            className={`${isModal ? styles.modalForm : styles.form}`}
            id={id}
            onSubmit={handleSubmit}
        >
            {title && <h3 className={styles.formTitle}>{title}</h3>}
            {isSectioned ? (fields.map((section, index) => (
                <div
                    key={index}
                    className={styles.formSection}
                >
                    {
                        section.title &&
                        <h4 className={styles.sectionTitle}>
                            {section.title}
                        </h4>
                    }
                    <div className={`${isModal ? styles.modalInputs : styles.formInputs}`}>
                        {section.fields.map(renderField)}
                    </div>
                </div>
            ))) :
                (
                    <div
                        className={`${isModal ? styles.modalInputs : styles.formInputs} ${!btnText ? styles.noButton : ''}`}>
                        {fields.map(renderField)}
                    </div>
                )
            }
            {!isModal && btnText && <button type="submit" disabled={isButtonDisabled}>{btnText}</button>}
        </form>);
}
