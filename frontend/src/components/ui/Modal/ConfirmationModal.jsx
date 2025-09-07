import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import styles from './styles.module.css';

export default function ConfirmationModal({open, onConfirm, onCancel, title, message}) {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            aria-labelledby="confirmation-dialog-title"
            aria-describedby="confirmation-dialog-description"
            className={"modalContent"}
        >
            <DialogTitle id="confirmation-dialog-title" className={styles.title}>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="confirmation-dialog-description" className={styles.msg}>
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions className={styles.actions}>
                <Button onClick={onCancel} sx={{color: 'var(--primary-text-color)'}}>Cancel</Button>
                <Button onClick={onConfirm} autoFocus variant="contained" color="error">
                    تأكيد
                </Button>
            </DialogActions>
        </Dialog>
    );
}
