import styles from './styles.module.css';
import SearchIcon from '@mui/icons-material/Search';
import SelectField from "@ui/SelectField/SelectField.jsx";

export default function TableToolbar({searchTerm, setSearchTerm, perPage = 30, setPerPage, disabled = false}) {
    return (
        <div className={styles.toolbar}>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="بحث..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                    disabled={disabled}
                />
                <SearchIcon className={styles.searchIcon}/>
            </div>




        </div>
    );
}
