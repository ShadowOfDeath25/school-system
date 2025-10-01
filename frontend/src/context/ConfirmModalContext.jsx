import {createContext, useCallback, useContext, useState} from "react";

import ConfirmModal from "@ui/ConfirmModal/ConfirmModal.jsx";

const ConfirmModalContext = createContext(null)
export const useConfirmModal = () => {
    const context = useContext(ConfirmModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ConfirmModalProvider');
    }
    return context;
}

export function ConfirmModalProvider({children}) {
    const [modal, setModal] = useState({
        open: false, msg: '', type: 'info',warning:'',
    });
    const [confirmationState, setConfirmationState] = useState(null);

    const showModal = useCallback((msg, type = 'warning',warning) => {
        setModal({open: true, msg, type,warning});
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
        <ConfirmModalContext.Provider value={{showEditModal: showModal, confirm}}>
            {children}

            {confirmationState && (
                <ConfirmModal
                    open={Boolean(confirmationState)}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    message={confirmationState.message}
                    warning={confirmationState.warning}
                />
            )}
        </ConfirmModalContext.Provider>
    );
}
