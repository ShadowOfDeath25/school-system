import styles from './styles.module.css'
import {IconButton} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import ProfileMenu from "@ui/ProfileMenu/ProfileMenu.jsx";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {useOutletContext} from "react-router";

export default function Navbar({handleMenuClick}) {


    return (
        <header className={styles.navbar}>
            <IconButton sx={{"&:hover":{backgroundColor:"rgba(0,0,0,0.2)"}}} onClick={handleMenuClick}><MenuIcon className={styles.menuIcon}/></IconButton>
            <img src="/public/logo.svg" alt="logo"/>
            <ProfileMenu/>
        </header>
    );
}

