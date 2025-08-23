import Sidebar from "../../Sidebar/Sidebar.jsx";
import Navbar from "../../Navbar/Navbar.jsx";
import styles from "./styles.module.css"
import {useEffect, useState} from "react";
import {Outlet} from 'react-router-dom';
import axiosClient from "../../../axiosClient.js";

export default function DefaultLayout() {
    const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
    useEffect(() => {
        axiosClient.get("/csrf-cookie").then();
        console.log(import.meta.env.VITE_BASE_API_URL);
    }, []);
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

