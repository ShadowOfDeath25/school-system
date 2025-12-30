import {useOutletContext} from "react-router";
import styles from './styles.module.css'
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {Button} from "@mui/material";
import {useLogout} from "@hooks/api/auth.js";
import {useState} from "react";
import {useWindowSize} from "@hooks/useWindowSize.js";

export default function ProfileMenu() {
    const {user} = useOutletContext()
    const logoutMutation = useLogout()
    const windowSize = useWindowSize();
    const [open, setOpen] = useState(false);
    const handleLogout = () => {
        logoutMutation.mutate()
    }


    return (
        <div className={styles.profile}
             onMouseEnter={() => setOpen(true)}
             onMouseLeave={() => setOpen(false)}
             onClick={() => setOpen(true)}
        >
            {
                (windowSize.width > 768) && user.name
            }
            <AccountCircleIcon fontSize={"large"}/>
            <div
                className={`${styles.dropdown} ${open ? "" : styles.closed}`}
            >
                <button onClick={handleLogout}>تسجيل الخروج</button>

            </div>
        </div>
    );
}
