import styles from './style.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";

export default function Page({title, breadcrumbs, children}) {
    return (
        <div className={styles.container}>
            <div className={styles.heading}>
                <h2>{title}</h2>
                <Breadcrumbs>
                    {breadcrumbs}
                </Breadcrumbs>
            </div>
            <div className={styles.content}>{children}</div>
        </div>
    );
}
