import styles from './styles.module.css'
import {useState} from "react";
import {CircularProgress, IconButton} from "@mui/material";
import {EmailOutlined, LockOutlined, Visibility, VisibilityOff} from "@mui/icons-material";
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
        <main className={styles.loginPage}>
            <section className={styles.brandPanel} aria-label="مدرسة التربية الحديثة الخاصة">
                <div className={styles.gridPattern}/>
                <div className={styles.brandContent}>
                    <div className={styles.logoFrame}>
                        <img src="/logo.svg" alt="شعار مدرسة التربية الحديثة الخاصة"/>
                    </div>
                    <h1>مدرسة <span>التربية الحديثة الخاصة</span></h1>
                    <p>بوابة الموظفين والكوادر التعليمية لإدارة العملية التربوية بكفاءة وتميز.</p>
                </div>
                <div className={styles.brandFooter} aria-hidden="true">
                    <span>Institutional Excellence</span><i/>
                </div>
            </section>

            <section className={styles.formPanel}>
                <div className={styles.formContent}>
                    <div className={styles.mobileBrand}>
                        <img src="/logo.svg" alt="شعار مدرسة التربية الحديثة الخاصة"/>
                        <strong>مدرسة التربية الحديثة الخاصة</strong>
                    </div>
                    <header className={styles.formHeader}>
                        <h2>تسجيل الدخول</h2>
                        <p>يرجى إدخال بيانات الاعتماد الخاصة بك للوصول</p>
                    </header>

                    <Errors error={error?.response?.data}/>

                    <form action="" className={styles.loginForm} onSubmit={handleLogin}>
                <div className={`${styles.inputWrapper}`}>
                    <label htmlFor="email">البريد الإلكتروني</label>
                    <div className={styles.fieldControl}>
                        <EmailOutlined aria-hidden="true"/>
                        <input type="email" dir="ltr" id="email" value={email}
                               placeholder="name@school.edu" autoComplete="email" required
                               onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                </div>
                <div className={`${styles.inputWrapper}`}>
                    <label htmlFor="password">كلمة السر</label>

                    <div className={styles.passwordInputContainer}>
                        <LockOutlined className={styles.fieldIcon} aria-hidden="true"/>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            dir="ltr"
                            placeholder="••••••••"
                            autoComplete="current-password"
                            required
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
                    <input type="checkbox" name="remember" checked={remember}
                           onChange={() => setRemember(!remember)} id="remember"/>
                    <label htmlFor="remember">تذكرني في المرة القادمة</label>
                </div>
                <button className={styles.signInBtn} type="submit" disabled={isLoading}>{isLoading ?
                    <CircularProgress size={22}/> : "تسجيل الدخول للنظام"}</button>
            </form>
                </div>
            </section>
        </main>
    );
}
