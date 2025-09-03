import InputField from "@ui/InputField/InputField.jsx";
import SelectField from "@ui/SelectField/SelectField.jsx";
import styles from './styles.module.css'
import {useCallback, useEffect, useState} from "react";

export default function Form({fields, title, btnText = "إضافة", onFormSubmit, serverErrors}) {
    const [formData, setFormData] = useState(() =>
        fields.reduce((acc, field) => {
            acc[field.name] = field.value ?? "";
            return acc;
        }, {})
    );
    const [validity, setValidity] = useState(() =>
        fields.reduce((acc, field) => {
            acc[field.name] = undefined;
            return acc;
        }, {})
    );

    useEffect(() => {
        if (serverErrors && Object.keys(serverErrors).length > 0) {
            const newValidity = {};
            for (const fieldName in serverErrors) {
                if (formData.hasOwnProperty(fieldName)) {
                    newValidity[fieldName] = false;
                }
            }
            setValidity(prev => ({...prev, ...newValidity}));


            setFormData(prev => ({
                ...prev,
                password: "",
                password_confirmation: ""
            }));
        }
    }, [serverErrors]);

    const handleChange = useCallback((e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));


        if (name === 'password' && validity.password_confirmation !== undefined) {
            const confirmField = fields.find(f => f.name === 'password_confirmation');
            if (confirmField?.validator) {
                const isConfirmValid = confirmField.validator(value, formData.password_confirmation);
                setValidity(prevValidity => ({...prevValidity, password_confirmation: isConfirmValid}));
            }
        }

    }, [fields, formData, validity]);

    const handleBlur = useCallback((e) => {
        const {name, value} = e.target;
        const field = fields.find(f => f.name === name);
        if (!field) return;


        if (!field.validator) {
            setValidity((prev) => ({...prev, [name]: true}));
            return;
        }

        let isValid;
        if (field.name === "password_confirmation") {
            isValid = field.validator(formData.password, value);
        } else {
            isValid = field.validator(value);
        }
        setValidity((prev) => ({...prev, [name]: isValid}));
    }, [fields, formData]);

    const onSubmit = (e) => {
        e.preventDefault();

        const newValidity = {};
        let isFormValid = true;
        for (const field of fields) {
            let isValid = true;
            if (field.validator) {
                if (field.name === 'password_confirmation') {
                    isValid = field.validator(formData.password, formData[field.name]);
                } else {
                    isValid = field.validator(formData[field.name]);
                }
            }
            newValidity[field.name] = isValid;
            if (!isValid) {
                isFormValid = false;
            }
        }

        setValidity(newValidity);
        if (isFormValid) {
            if (onFormSubmit) {
                onFormSubmit(formData);
            }
        } else {
            console.log("Form is invalid, please check the errors.");
        }
    }


    const isFormInvalid = Object.values(validity).some(v => v === false);
    const hasEmptyFields = fields.some(field => {
        const isRequired = field.required !== false;
        return isRequired && formData[field.name] === '';
    });
    const isButtonDisabled = isFormInvalid || hasEmptyFields;

    return (
        <form className={styles.form} onSubmit={onSubmit}>
            {title && <h3>{title}</h3>}
            <div className={styles.formInputs}>
                {fields.map((field) => {
                    const serverErrorForField = serverErrors?.[field.name]?.[0];
                    const commonProps = {
                        ...field,
                        value: formData[field.name],
                        handleChange: handleChange,
                        handleBlur: handleBlur,
                        error: serverErrorForField || field.error,
                        isValid: validity[field.name],
                    };
                    if (field.type === 'select') {
                        return <SelectField key={field.id || field.name} {...commonProps} />;
                    }

                    return <InputField key={field.id || field.name} {...commonProps} />;
                })}
            </div>
            <button type="submit" disabled={isButtonDisabled}>{btnText}</button>
        </form>
    );
}
