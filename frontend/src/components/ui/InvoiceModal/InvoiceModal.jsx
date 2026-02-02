import React, { useRef } from 'react';
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { useReactToPrint } from 'react-to-print';

export default function InvoiceModal({ open, onClose, children, title = "معاينة الملف", logo }) {
    const contentRef = useRef(null);

    const handlePrint = useReactToPrint({
        contentRef,
        documentTitle: title,
    });

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            dir="rtl"
            PaperProps={{
                sx: {
                    backgroundColor: "var(--primary-color)",
                    color: "var(--primary-text-color, white)"
                }
            }}
        >
            <DialogContent style={{ height: '70vh', padding: '20px', overflow: 'auto', backgroundColor: '#525659' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="print-container" style={{ backgroundColor: 'white', boxShadow: '0 0 10px rgba(0,0,0,0.5)', width: 'fit-content' }}>
                        {React.isValidElement(children) ?
                            React.cloneElement(children, {
                                ref: contentRef,
                                logo: logo
                            }) : (
                                <div ref={contentRef}>
                                    {children}
                                </div>
                            )
                        }
                    </div>
                </div>
            </DialogContent>
            <DialogActions sx={{ gap: 2, padding: 2 }}>
                <Button onClick={handlePrint} variant="contained" color="primary">
                    طباعة
                </Button>
                <Button onClick={onClose} variant="contained" color="error">
                    إغلاق
                </Button>
            </DialogActions>
        </Dialog>
    );
}
