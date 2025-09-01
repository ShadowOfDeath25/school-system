import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert'
import {useMediaQuery} from "@mui/material";

export default function CustomSnackbar({msg, type, open, onClose}) {

    const isMobile = useMediaQuery('(max-width: 768px)');

    const anchorOrigin = {
        vertical: isMobile ? 'top' : 'bottom',
        horizontal: isMobile ? 'center' : "left",
    };

    return (
        <Snackbar
            autoHideDuration={4000}
            open={open}
            onClose={onClose}
            anchorOrigin={anchorOrigin}
            dir={"ltr"}
            sx={{
                ...(isMobile && { marginTop: '8vh' })
            }}
        >
            <Alert severity={type} variant={"filled"}>
                {msg}
            </Alert>
        </Snackbar>
    );
}
