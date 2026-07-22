import styles from "./styles.module.css"
import ErrorIcon from '@mui/icons-material/Error';

export default function Errors({error}) {
    const {message, errors} = error ?? {message: null, errors: null}
    const errorMessages = errors ? Object.values(errors).flat() : [message]

    return (
        <div className={`${styles.container} ${error ? styles.show : ''}`}
             role={error ? "alert" : undefined} aria-live="polite">
            <ErrorIcon className={styles.icon}/>
            <div className={styles.content}>
                <strong>تعذر تسجيل الدخول</strong>
                <ul>
                    {errorMessages && errorMessages.map((errorMessage, index) =>
                        errorMessage && <li key={index}>{errorMessage}</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
