import styles from './styles.module.css'
import {useState} from "react";
import {IconButton} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useLogin} from "../../../hooks/useAuth.js";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const loginMutation = useLogin();

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleLogin = async (e) => {
        e.preventDefault();
        loginMutation.mutate({email, password});
    }

    return (
        <>


            <form action="" className={`${styles.loginForm}`}>
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
                <button className={`${styles.signInBtn}`} onClick={handleLogin} type="submit">تسجيل الدخول</button>
            </form>

        </>
    );
}
