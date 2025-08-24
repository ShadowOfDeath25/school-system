import {Link} from "react-router";
import styles from "./styles.module.css"

export default function SidebarLink({to, children,setSideBar: setSideBarIsOpen}) {
    return (
        <Link to={to} className={styles.sidebarLink} onClick={()=>setSideBarIsOpen(true)}>
            {children}
        </Link>
    );
}

