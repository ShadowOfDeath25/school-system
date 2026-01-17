import styles from './styles.module.css'

export default function TextArea({
                                     name,
                                     placeholder,
                                     label,
                                     error,
                                     id,
                                     value,
                                     handleChange,
                                     handleBlur,
                                     isValid,
                                     isModal = false,
                                     rows = 4,
                                     helperText = "",
                                     props = {}

                                 }) {

    const isInvalid = isValid === false;

    return (
        <>
            <div className={`${styles.inputWrapper} ${isModal ? styles.modalInputWrapper : ""} `}>
                <label htmlFor={id}>{label}</label>
                <div>
                    <textarea
                        className={`${isInvalid ? styles.error : ""}`}
                        id={id}
                        name={name}
                        placeholder={placeholder ?? ""}
                        value={value}
                        onChange={handleChange}
                        dir="auto"
                        onBlur={handleBlur}
                        rows={rows}
                        {...{props}}
                    />
                    {helperText && <span className={styles.helperText}>{helperText}</span>}
                    {isInvalid && <span>{error}</span>}
                </div>
            </div>
        </>
    );
}
