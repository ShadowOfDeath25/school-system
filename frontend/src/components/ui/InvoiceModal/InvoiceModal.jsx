import React, {useState, useEffect} from 'react';
import {Button, Dialog, DialogActions, DialogContent} from "@mui/material";
import {PDFViewer} from '@react-pdf/renderer';
import InvoicePDF from '@reports/InvoicePDF';
import {useGetAll} from "@hooks/api/useCrud.js";
import {useOutletContext} from "react-router";

export default function InvoiceModal({open, onClose, payment}) {
    const [logoBase64, setLogoBase64] = useState(null);
    const {student, academicYear, user} = useOutletContext()
    const {data: fees} = useGetAll(`students/${student?.id}/payments`, {academic_year: academicYear}, {
        enabled: !!student?.id && open
    });

    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = '/logo.svg';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.filter = 'grayscale(100%)';
            ctx.drawImage(img, 0, 0);
            try {
                const dataURL = canvas.toDataURL('image/png');
                setLogoBase64(dataURL);
            } catch (error) {
                console.error("Error converting logo to PNG:", error);
            }
        };
        img.onerror = (err) => {
            console.error("Error loading logo.svg:", err);
        }
    }, []);

    if (!payment) return null;

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
            <DialogContent style={{height: '70vh', padding: 0, overflow: 'hidden'}}>
                <PDFViewer width="100%" height="100%" showToolbar={true} style={{border: 'none'}}>
                    <InvoicePDF payment={payment} student={student} logo={logoBase64} academicYear={academicYear}
                                summaryData={fees} recipientName={user?.name}/>
                </PDFViewer>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained" color="error">
                    إغلاق
                </Button>
            </DialogActions>
        </Dialog>
    );
}
