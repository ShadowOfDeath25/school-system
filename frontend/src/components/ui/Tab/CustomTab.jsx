import {Tab} from '@mui/material'

export default function CustomTab(props) {
    return (
        <Tab
            {...props}
            sx={{
                color: "white",
                '&.Mui-selected': {
                    color: "var(--primary-text-color)",
                    backgroundColor: "rgba(0,0,0,.2) !important"
                }
            }}
        />
    )
}

