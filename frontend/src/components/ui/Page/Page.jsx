import styles from './style.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {useMatches} from "react-router";
import {Link} from "react-router-dom";

export default function Page({children}) {
    const matches = useMatches()
    const breadcrumbs = matches.filter((match) => match.handle).map((match) => {
        return <Link className={styles.breadcrumbLink}
                     to={match.pathname}>{match.handle.sidebar.header || match.handle.sidebar.title}</Link>
    })
    const title2 = matches[matches.length - 1].handle.sidebar.title;

    return (
        <div className={styles.container}>
            <div className={styles.heading}>
                <h2>{title2}</h2>
                <Breadcrumbs>
                    {breadcrumbs}
                </Breadcrumbs>
            </div>
            <div className={styles.content}>{children}</div>
        </div>
    );
}
