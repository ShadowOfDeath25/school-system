import { createContext, useCallback, useContext, useState } from 'react';
import CustomSnackbar from '@components/ui/CustomSnackbar/CustomSnackbar.jsx';
import { Box, Stack, useMediaQuery } from '@mui/material';

const SnackbarContext = createContext(null);


export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};


export const SnackbarProvider = ({ children }) => {
    const [snackbars, setSnackbars] = useState([]);

    const showSnackbar = useCallback((msg, type = 'success') => {
        const id = Date.now() + Math.random();
        setSnackbars(prev => [...prev, { id, msg, type, open: true }]);
    }, []);

    const handleClose = useCallback((id) => {
        setSnackbars(prev => prev.map(snack =>
            snack.id === id ? { ...snack, open: false } : snack
        ));
    }, []);

    const handleExited = useCallback((id) => {
        setSnackbars(prev => prev.filter(snack => snack.id !== id));
    }, []);

    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Box
                sx={{
                    position: 'fixed',
                    zIndex: 2000,
                    pointerEvents: 'none',
                    ...(isMobile ? {
                        top: '8vh',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 'calc(100% - 32px)',
                        maxWidth: '400px',
                    } : {
                        bottom: 24,
                        left: 24,
                        width: 'auto',
                    })
                }}
            >
                <Stack
                    spacing={1}
                    direction={isMobile ? "column" : "column-reverse"}
                    alignItems={isMobile ? "center" : "flex-start"}
                >
                    {snackbars.map((snack) => (
                        <Box key={snack.id} sx={{ pointerEvents: 'auto', width: isMobile ? '100%' : 'auto' }}>
                            <CustomSnackbar
                                open={snack.open}
                                msg={snack.msg}
                                type={snack.type}
                                onClose={() => handleClose(snack.id)}
                                onExited={() => handleExited(snack.id)}
                            />
                        </Box>
                    ))}
                </Stack>
            </Box>
        </SnackbarContext.Provider>
    );
};
