import {Button, Dialog, DialogActions, DialogContent, DialogContentText} from "@mui/material";
import styles from './styles.module.css';
import WarningIcon from '@mui/icons-material/Warning'

export default function ConfirmModal({open, onConfirm, onCancel, message}) {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            aria-labelledby="confirmation-dialog-title"
            aria-describedby="confirmation-dialog-description"
            className={"modalContent"}
        >
            <DialogContent className={styles.content}>
                <WarningIcon className={styles.warningIcon}/>
                <DialogContentText id="confirmation-dialog-description" className={styles.msg}>
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions className={styles.actions}>
                <Button onClick={onCancel} sx={{color: 'var(--primary-text-color)'}}>إلغاء</Button>
                <Button onClick={onConfirm} autoFocus variant="contained" color="error">
                    تأكيد
                </Button>
            </DialogActions>
        </Dialog>
    );
}
