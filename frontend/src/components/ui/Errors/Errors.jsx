import styles from "./styles.module.css"
import ErrorIcon from '@mui/icons-material/Error';

export default function Errors({error}) {
    const {message, errors} = error ?? {message: null, errors: null}
    let errorMessages = errors ? Object.values(errors).flat() : [message]
    console.log(errorMessages);

    return (
        <div className={`${styles.container} ${error ? styles.show : ''}`}>
            <ErrorIcon/>

            <ul>
                {errorMessages && errorMessages.map((errorMessage, index) => <li key={index}>{errorMessage}</li>)}

            </ul>
        </div>
    );
}
