import CustomAccordion from "../Accordion/CustomAccordion.jsx";
import styles from './styles.module.css';
import {useState} from "react";
import SearchIcon from '@mui/icons-material/Search';
import sidebarItems from "./sidebarItems.js";
import SidebarLink from "../SidebarLink/SidebarLink.jsx";

export default function Sidebar() {
    const [expanded, setExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const filteredItems = sidebarItems.filter(item => item.header.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <aside className={styles.sidebar}>
            <div className={styles.searchContainer}>
                <SearchIcon className={styles.searchIcon}/>
                <input
                    type="text"
                    placeholder="البحث في القائمة ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>
            {filteredItems.map(item => (
                <CustomAccordion
                    key={item.panel}
                    header={item.header}
                    expanded={expanded === item.panel}
                    onChange={handleChange(item.panel)}
                >
                    {item.links.map((link, index) => <SidebarLink key={index} to={link.to}>{link.title}</SidebarLink>)}
                </CustomAccordion>
            ))}
        </aside>);
}
