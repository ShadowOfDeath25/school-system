import {CircularProgress} from "@mui/material";
import styles from './styles.module.css'

export default function LoadingScreen({color}) {
    return (
        <>
            <div className={styles.container}>
                <CircularProgress sx={{color: color ?? "var(--secondary-color)"}}/>
            </div>
        </>
    );
}

