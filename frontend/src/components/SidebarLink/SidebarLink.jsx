import {Link} from "react-router";
import styles from "./styles.module.css"

export default function SidebarLink(props) {
    return (
        <Link to={props.to} className={styles.sidebarLink}>
            {props.children}
        </Link>
    );
}

