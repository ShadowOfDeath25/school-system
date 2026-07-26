import { useEffect, useRef, useState } from "react";
import styles from './styles.module.css';

export default function AgeField({
    name,
    label,
    formData,
    formErrors,
    handleChange,
    handleBlur,
    setFieldValue,
    required = false,
    isModal = false,
}) {
    const yearsKey = `${name}_years`;
    const monthsKey = `${name}_months`;
    const [touched, setTouched] = useState({});

    const yearsError = formErrors?.[yearsKey];
    const monthsError = formErrors?.[monthsKey];
    const isInvalid = yearsError || monthsError;

    const handleYearsChange = (e) => {
        handleChange({ target: { name: yearsKey, value: e.target.value } });
    };

    const handleMonthsChange = (e) => {
        handleChange({ target: { name: monthsKey, value: e.target.value } });
    };

    const handleYearsBlur = (e) => {
        handleBlur?.(e);
        setTouched(prev => ({ ...prev, yearsKey: true }));
    };

    const handleMonthsBlur = (e) => {
        handleBlur?.(e);
        setTouched(prev => ({ ...prev, monthsKey: true }));
    };

    return (
        <div className={`${styles.inputWrapper} ${isModal ? styles.modalInputWrapper : ''}`}>
            <label>{label}</label>
            <div className={styles.inputsRow}>
                <input
                    type="number"
                    value={formData?.[yearsKey] ?? ''}
                    onChange={handleYearsChange}
                    onBlur={handleYearsBlur}
                    placeholder="سنوات"
                    className={`${styles.smallInput} ${yearsError ? styles.error : ''}`}
                />
                <span className={styles.unit}>سنوات</span>
                <input
                    type="number"
                    value={formData?.[monthsKey] ?? ''}
                    onChange={handleMonthsChange}
                    onBlur={handleMonthsBlur}
                    placeholder="شهور"
                    className={`${styles.smallInput} ${monthsError ? styles.error : ''}`}
                />
                <span className={styles.unit}>شهور</span>
                {isInvalid && touched && (
                    <span className={styles.errorText}>{yearsError || monthsError}</span>
                )}
            </div>
        </div>
    );
}
