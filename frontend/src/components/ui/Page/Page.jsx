import styles from './style.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {useMatches} from "react-router";
import {Link} from "react-router-dom";

export default function Page({title,  children, }) {
    const matches = useMatches()
    const breadcrumbs = matches.filter((match) => match.handle).map((match) => {
        return <Link className={styles.breadcrumbLink} to={match.pathname}>{match.handle.sidebar.header || match.handle.sidebar.title}</Link>
    })

    return (
        <div className={styles.container}>
            <div className={styles.heading}>
                <h2>{title}</h2>
                <Breadcrumbs>
                    {breadcrumbs}
                </Breadcrumbs>
            </div>
            <div className={styles.content}>{children}</div>
        </div>
    );
}
