import styles from './styles.module.css'
import {IconButton} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import {useState} from "react";

export default function Navbar({handleMenuClick}) {


    return (
        <nav className={styles.navbar}>
            <IconButton onClick={handleMenuClick}><MenuIcon className={styles.menuIcon}/></IconButton>
            <img src="/public/logo.svg" alt="logo"/>
            <div className="profile">Profile</div>
        </nav>
    );
}

