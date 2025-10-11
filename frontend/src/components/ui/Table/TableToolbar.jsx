import styles from './styles.module.css';
import SearchIcon from '@mui/icons-material/Search';
import {MenuItem, Select} from "@mui/material";

export default function TableToolbar({searchTerm, setSearchTerm, perPage=localStorage.getItem("per_page"), setPerPage, disabled = false}) {
    const handlePerPageChange = (e) => {
        setPerPage(e.target.value)
        localStorage.setItem('per_page', e.target.value)
    }
    return (<div className={styles.toolbar}>
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
        <Select
            variant={'outlined'}
            value={perPage}
            onChange={handlePerPageChange}
            disabled={disabled}
            sx={{
                color: 'white',
                borderRadius: '10px',
                '.MuiOutlinedInput-notchedOutline': {borderColor: 'var(--secondary-color)', borderWidth: "2px"},
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {borderColor: 'white'},
                '.MuiSvgIcon-root': {color: 'white'},
                '.MuiSelect-select': {padding: '8.5px 14px'},

                backgroundColor: 'rgba(255,255,255,0.1)'
            }}
        >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={40}>40</MenuItem>
            <MenuItem value={50}>50</MenuItem>
        </Select>
    </div>);
}
