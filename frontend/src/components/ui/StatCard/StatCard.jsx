import styles from './styles.module.css'
import GroupsIcon from '@mui/icons-material/Groups';
export default function StatCard({stat, label, icon,backgroundColor}) {
    return (
        <>
            <div className={styles.container}>
                <div className={styles.texts}>
                    <h4>{label}</h4>
                    <span>{stat}</span>
                </div>
                <div className={styles.icon} style={{backgroundColor:backgroundColor}}>
                    {icon}
                </div>
            </div>
        </>
    );
}

