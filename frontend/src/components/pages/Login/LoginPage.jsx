import styles from './styles.module.css'
import {useState} from "react";
import {CircularProgress, IconButton} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useLogin} from "@hooks/api/auth.js";
import Errors from "@ui/Errors/Errors.jsx"


export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const {mutate: login, error, isLoading} = useLogin();

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleLogin = async (e) => {
        e.preventDefault();
        login({email, password, remember})

    }
    // Todo: handle loading state
    return (
        <>

            <Errors
                error={error?.response?.data}
            />

            <form action="" className={`${styles.loginForm} ${error ? styles.pushDown : ""}`}>
                <div className={`${styles.inputWrapper}`}>
                    <label htmlFor="email">البريد الإلكتروني</label>
                    <input
                        type="text"
                        dir={"ltr"}
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className={`${styles.inputWrapper}`}>
                    <label htmlFor="password">كلمة السر</label>

                    <div className={styles.passwordInputContainer}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            dir={"ltr"}
                            id="password" value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                            className={styles.showPasswordButton}
                        >
                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                        </IconButton>
                    </div>
                </div>
                <div className={styles.rememberMe}>
                    <label htmlFor="remember">تذكرني</label>
                    <input type="checkbox" name="remember" value={remember}
                           onChange={() => setRemember(!remember)} id="remember"/>
                </div>
                <button className={`${styles.signInBtn}`} onClick={handleLogin} type="submit">{isLoading ?
                    <CircularProgress/> : "تسجيل الدخول"}</button>
            </form>

        </>
    );
}
