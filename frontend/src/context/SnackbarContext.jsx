import {createContext, useCallback, useContext, useState} from 'react';
import CustomSnackbar from '@ui/CustomSnackbar/CustomSnackbar.jsx';

const SnackbarContext = createContext(null);


export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};


export const SnackbarProvider = ({children}) => {
    const [snackbar, setSnackbar] = useState({
        open: false, msg: '', type: 'info',
    });

    const showSnackbar = useCallback((msg, type = 'success') => {
        setSnackbar({open: true, msg, type});
    }, []);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar(prev => ({...prev, open: false}));
    };

    return (<SnackbarContext.Provider value={{showSnackbar}}>
            {children}
            <CustomSnackbar
                open={snackbar.open}
                msg={snackbar.msg}
                type={snackbar.type}
                onClose={handleClose}
            />
        </SnackbarContext.Provider>);
};
