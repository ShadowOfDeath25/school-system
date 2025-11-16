import styles from './style.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {useMatches} from "react-router";
import {Link} from "react-router-dom";

export default function Page({children, breadcrumbsLinks}) {
    const matches = useMatches()
    const breadcrumbs =breadcrumbsLinks?
        [
            ...breadcrumbsLinks,
            <Link
                className={styles.breadcrumbLink}
                to={matches[matches.length - 1].pathname}
            >
                {
                    matches[matches.length - 1].handle?.sidebar?.header ||
                    matches[matches.length - 1].handle?.sidebar?.title ||
                    matches[matches.length - 1].handle?.title
                }
            </Link>
        ]
        :
        matches.filter((match) => match.handle).map((match) => {
            return <Link
                className={styles.breadcrumbLink}
                to={match.pathname}
            >
                {
                    match?.handle?.sidebar?.header ||
                    match?.handle?.sidebar?.title ||
                    match?.handle?.title}
            </Link>
        })
    const title2 = matches[matches.length - 1].handle?.sidebar?.title ?? matches[matches.length - 1].handle?.title;

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
