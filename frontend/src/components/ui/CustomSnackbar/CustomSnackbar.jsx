import React, { useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Grow from '@mui/material/Grow';

export default function CustomSnackbar({ msg, type, open, onClose, onExited }) {
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                onClose();
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [open, onClose]);

    return (
        <Grow in={open} onExited={onExited}>
            <Alert
                severity={type}
                variant="filled"
                onClose={onClose}
                dir="rtl"
                sx={{
                    boxShadow: 3,
                    minWidth: '300px',
                    maxWidth: '450px',
                    width: '100%',
                    alignItems: "center",
                    '& .MuiAlert-message': {
                        flexGrow: 1,
                        textAlign: 'start',
                        paddingInlineStart: '8px',
                        fontSize: '1rem',
                    },
                    '& .MuiAlert-action': {
                        paddingInlineStart: '16px',
                        paddingInlineEnd: '4px',
                        alignItems: 'center',
                    },
                }}
            >
                {msg}
            </Alert>
        </Grow>
    );
}
