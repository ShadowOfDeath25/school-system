import styles from './style.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";

export default function Page({title, breadcrumbs, children}) {
    return (
        <div className={styles.container}>
            <div className={styles.heading}>
                <h3>{title}</h3>
                <Breadcrumbs>
                    {breadcrumbs}
                </Breadcrumbs>
            </div>
            <div className={styles.content}>{children}</div>
        </div>
    );
}
