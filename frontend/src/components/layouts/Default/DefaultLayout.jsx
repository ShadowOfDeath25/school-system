import Sidebar from "@ui/Sidebar/Sidebar.jsx";
import Navbar from "@ui/Navbar/Navbar.jsx";
import styles from "./styles.module.css";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function DefaultLayout() {
    const [sidebarIsOpen, setSidebarIsOpen] = useState(
        JSON.parse(localStorage.getItem("sideBarIsOpen")) ?? false
    );

    const handleMenuClick = () => {
        setSidebarIsOpen((prev) => {
            const val = !prev;
            localStorage.setItem("sideBarIsOpen", val);
            return val;
        });
    };

    return (
        <div className={styles.container}>
            <Sidebar isOpen={sidebarIsOpen} setIsOpen={setSidebarIsOpen} />
            <div className={styles.content}>
                <Navbar handleMenuClick={handleMenuClick} />
                <Outlet />
            </div>
        </div>
    );
}
