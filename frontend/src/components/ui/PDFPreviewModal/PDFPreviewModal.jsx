import React from 'react';
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";

export default function PDFPreviewModal({ open, onClose, url, title = "معاينة الملف" }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            dir="rtl"
            PaperProps={{
                sx: {
                    backgroundColor: "var(--primary-color)",
                    color: "var(--primary-text-color, white)"
                }
            }}
        >
            <DialogContent style={{ height: '80vh', padding: 0, overflow: 'hidden' }}>
                <iframe
                    src={url}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none'
                    }}
                    title={title}
                />
            </DialogContent>
            <DialogActions sx={{ gap: 2, padding: 2 }}>
                <Button onClick={onClose} variant="contained" color="error">
                    إغلاق
                </Button>
            </DialogActions>
        </Dialog>
    );
}
