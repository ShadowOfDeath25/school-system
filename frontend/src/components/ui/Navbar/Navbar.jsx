import styles from './styles.module.css'
import {IconButton} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';


export default function Navbar({handleMenuClick}) {


    return (
        <nav className={styles.navbar}>
            <IconButton sx={{"&:hover":{backgroundColor:"rgba(0,0,0,0.2)"}}} onClick={handleMenuClick}><MenuIcon className={styles.menuIcon}/></IconButton>
            <img src="/public/logo.svg" alt="logo"/>
            <div className="profile">Profile</div>
        </nav>
    );
}

