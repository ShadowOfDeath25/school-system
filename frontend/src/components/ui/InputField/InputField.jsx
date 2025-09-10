import {useState} from "react";
import styles from './styles.module.css'
import {IconButton} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";

export default function InputField({
                                       type,
                                       name,
                                       placeholder,
                                       label,
                                       error,
                                       id,
                                       value,
                                       handleChange,
                                       handleBlur,
                                       isValid,
                                        isModal=false

                                   }) {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword((show) => !show);
    }

    const isInvalid = isValid === false;

    return (
        <>
            <div className={`${styles.inputWrapper} ${isModal ? styles.modalInputWrapper : ""} `}>
                <label htmlFor={id}>{label}</label>
                <div>
                    <input
                        className={`${isInvalid ? styles.error : ""} ${type === "password" ? styles.password : ""}`}
                        id={id}
                        type={type === "password" ? (showPassword ? "text" : "password") : type}
                        name={name}
                        placeholder={placeholder ?? ""}
                        value={value}
                        onChange={handleChange}
                        dir="auto"
                        onBlur={handleBlur}
                    />
                    {type === "password" &&
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                            className={styles.showPasswordButton}
                        >
                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                        </IconButton>
                    }
                    {isInvalid && <span>{error}</span>}
                </div>
            </div>
        </>
    );
}
