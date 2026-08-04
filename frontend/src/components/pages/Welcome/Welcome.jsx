import {useMemo} from "react";
import styles from './styles.module.css';
import {Link} from "react-router-dom";
import {useCurrentUser} from "@hooks/api/auth.js";
import sidebarItems from "@ui/Sidebar/sidebarItems.js";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

export default function Welcome() {
    const {data: user} = useCurrentUser();

    const links = useMemo(() => {
        if (!user) return [];

        const isSuperAdmin = user.role.includes("Super Admin");

        return sidebarItems.flatMap(item => {
            const accessible = isSuperAdmin
                ? item.links
                : item.links.filter(link => user.permissions?.contains(link.action));

            return accessible.map(link => ({
                ...link,
                panelHeader: item.header,
            }));
        });
    }, [user]);

    return (
        <div className={styles.welcome}>
            <div className={styles.hero}>
                <div className={styles.logoFrame}>
                    <img src="/logo.svg" alt="شعار مدرسة التربية الحديثة الخاصة"/>
                </div>
                <h1>أهلاً بك{user?.name ? `، ${user.name}` : ''}</h1>
                <p>نظام إدارة مدرسة التربية الحديثة الخاصة</p>
            </div>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>الوصول السريع</h2>
                {links.length > 0 ? (
                    <div className={styles.tiles}>
                        {links.map((link, index) => (
                            <Link key={index} to={link.to} className={styles.tile}>
                                <span className={styles.tileIcon}>
                                    <RocketLaunchIcon/>
                                </span>
                                <span className={styles.tileText}>
                                    <strong>{link.title}</strong>
                                    <small>{link.panelHeader}</small>
                                </span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className={styles.empty}>لا توجد صفحات متاحة لك حالياً، تواصل مع المسؤول.</p>
                )}
            </section>
        </div>
    );
}
