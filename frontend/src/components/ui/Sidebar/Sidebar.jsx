import CustomAccordion from "@ui/Accordion/CustomAccordion.jsx";
import styles from './styles.module.css';
import {useState} from "react";
import SearchIcon from '@mui/icons-material/Search';
import sidebarItems from "./sidebarItems.js";
import SidebarLink from "@ui/SidebarLink/SidebarLink.jsx";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import {useCurrentUser} from "@hooks/api/auth.js";

export default function Sidebar({isOpen, setIsOpen}) {
    const {data: user} = useCurrentUser();
    const [expanded, setExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const allowedItems = sidebarItems.filter((item) => {
        return user?.roles?.includes("Super Admin") || user?.permissions?.includes(`view ${item.name}`);
    })
    const filteredItems = allowedItems.filter(item => item.header.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    }
    const handleCloseIconClick = (e) => {
        setIsOpen(false);
        localStorage.setItem("sideBarIsOpen", JSON.stringify(false));
    }

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
            <IconButton
                onClick={handleCloseIconClick}
                className={styles.closeButton}
            >
                <CloseIcon sx={{color: "var(--primary-text-color)"}}/>
            </IconButton>
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
            {filteredItems.map(item => (<CustomAccordion
                key={item.panel}
                header={item.header}
                expanded={expanded === item.panel}
                onChange={handleChange(item.panel)}
            >
                {
                    item.links.filter((link) => user.roles.includes("Super Admin") || user.permissions.includes(link.action)).map((link, index) =>
                        <SidebarLink
                            key={index}
                            setSideBarIsOpen={setIsOpen}
                            to={link.to}
                        >
                            {link.title}
                        </SidebarLink>
                    )
                }
            </CustomAccordion>))}
        </aside>
    );
}
