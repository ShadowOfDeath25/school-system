import styles from './styles.module.css'
import {Outlet} from 'react-router-dom'
import {useSelector} from "react-redux";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";

export default function GuestLayout() {
    const authState = useSelector(state => state.auth);

    if (authState?.isLoading) {
        return <LoadingScreen color={"#fff"}/>
    }

    return (
        <div className={styles.container}>
            <Outlet/>
        </div>
    );
}
