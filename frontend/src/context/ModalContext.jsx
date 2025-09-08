import {createContext, useCallback, useContext, useState} from "react";

import ConfirmationModal from "@ui/ConfirmationModal/ConfirmationModal.jsx";

const ModalContext = createContext(null)
export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
}

export function ModalProvider({children}) {
    const [modal, setModal] = useState({
        open: false, msg: '', type: 'info',
    });
    const [confirmationState, setConfirmationState] = useState(null);

    const showModal = useCallback((msg, type = 'warning') => {
        setModal({open: true, msg, type});
    }, []);

    const confirm = useCallback((options) => {
        return new Promise((resolve) => {
            setConfirmationState({ ...options, resolve });
        });
    }, []);

    const handleConfirm = () => {
        if (confirmationState) {
            confirmationState.resolve(true);
            setConfirmationState(null);
        }
    };

    const handleCancel = () => {
        if (confirmationState) {
            confirmationState.resolve(false);
            setConfirmationState(null);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setModal(prev => ({...prev, open: false}));
    };

    return (
        <ModalContext.Provider value={{showModal, confirm}}>
            {children}

            {confirmationState && (
                <ConfirmationModal
                    open={Boolean(confirmationState)}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    message={confirmationState.message}
                />
            )}
        </ModalContext.Provider>
    );
}
