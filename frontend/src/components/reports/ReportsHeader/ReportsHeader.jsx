import styles from "./styles.module.css"
import React from "react";
export default function ReportsHeader() {
    const schoolName = import.meta.env.VITE_SCHOOL_NAME ?? "مدرسة التربية الحديثة الخاصة";
    const governorate = "محافظة " + (import.meta.env.VITE_GOVERNORATE ?? "القليوبية");
    const administration = "ادارة " + (import.meta.env.VITE_ADMINISTRATION ?? "الخصوص") + " التعليمية";
    return (
        <>
            <header className={styles.header}>
                <div className={styles.logo}>
                    <img src={"/logo.svg"} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Logo" />
                </div>
                <div className={styles.schoolInfo}>
                    <span className={styles.headerText}>{governorate}</span>
                    <span className={styles.headerText}>{administration}</span>
                    <span className={styles.headerText}>{schoolName}</span>
                </div>
            </header>
        </>
    );
}

