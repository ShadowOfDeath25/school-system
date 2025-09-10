import styles from './styles.module.css';

export default function TablePagination({ links, onPageChange }) {

    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <div className={styles.pagination}>
            {links.map((link, index) => {
                const isDisabled = !link.url || link.active;
                return (
                    <button
                        key={`${link.label}-${index}`}
                        disabled={isDisabled}
                        onClick={() => onPageChange(link)}
                        dangerouslySetInnerHTML={{__html: link.label}}
                        className={link.active ? styles.active : ""}
                    />
                );
            })}
        </div>
    );
}
