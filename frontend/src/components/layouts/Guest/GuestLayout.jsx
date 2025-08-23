import styles from './styles.module.css'
import {Outlet} from 'react-router-dom'
export default function GuestLayout() {
    return (
        <>
            <div className={styles.container}>
                <Outlet/>
            </div>
        </>
    );
}

