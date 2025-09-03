import styles from './styles.module.css';

export default function SelectField({
                                        name,
                                        label,
                                        id,
                                        value,
                                        handleChange,
                                        handleBlur,
                                        isValid,
                                        error,placeholder,
                                        options = []
                                    }) {
    const isInvalid = isValid === false;

    return (
        <div className={styles.inputWrapper}>
            <label htmlFor={id}>{label}</label>
            <div>
                <select
                    id={id}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={isInvalid ? styles.error : ""}
                    dir="auto"
                >
                    <option key={"placeholder"} value={""} disabled={true}>{placeholder}</option>
                    {options.map(option => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled === true}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
                {isInvalid && <span>{error}</span>}
            </div>
        </div>
    );
}
