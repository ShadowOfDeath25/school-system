import Sidebar from "../../Sidebar/Sidebar.jsx";
import Navbar from "../../Navbar/Navbar.jsx";
import styles from "./styles.module.css"
import {useState} from "react";
import {Outlet} from 'react-router-dom';
export default function DefaultLayout() {
    const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
    const handleMenuClick = (e) => {
        setSidebarIsOpen(!sidebarIsOpen);

    }
    return (
        <>
            <div className={styles.container}>
                <Sidebar isOpen={sidebarIsOpen}/>
                <div className={styles.content}>
                    <Navbar handleMenuClick={handleMenuClick}/>
                    <Outlet/>
                </div>
            </div>
        </>
    );
}

