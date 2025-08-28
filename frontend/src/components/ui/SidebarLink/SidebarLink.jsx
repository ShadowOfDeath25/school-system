import {Link} from "react-router-dom";
import styles from "./styles.module.css"

export default function SidebarLink({to, children, setSideBarIsOpen}) {
    const handleClick = () => {
        if (window.innerWidth <= 768) {
            setSideBarIsOpen(false);
            localStorage.setItem("sideBarIsOpen", JSON.stringify(false));
        }
    };

    return (
        <Link to={to} className={styles.sidebarLink} onClick={handleClick}>
            {children}
        </Link>
    );
}
