import {createContext, useContext, useState} from 'react';
import InputModal from "@ui/InputModal/InputModal.jsx";

export const InputModalContext = createContext(null)
export const useInputModal = () => {
    const context = useContext(InputModalContext);
    if (!context) {
        throw new Error('useInputModal must be used within a InputModalProvider');
    }
    return context;
}

export function InputModalProvider({children}) {
    const [modalConfig, setModalConfig] = useState({
        open: false,
        fields: [],
        item: null,
        resource: "",
        serverErrors: null,
    });


    const handleClose = () => {
        setModalConfig({open: false, fields: [], item: null, resource: "", serverErrors: null});
    }
    const showInputModal = (config) => {
        setModalConfig({
            ...config,
            open: true,
            serverErrors: null,
        })
    }
    const hideInputModal = () => {
        setModalConfig({open: false, fields: [], item: null, resource: "", serverErrors: null});
    }


    return (
        <InputModalContext.Provider value={{showInputModal, hideInputModal}}>
            {children}
            {modalConfig.open &&
                <InputModal
                    open={modalConfig.open}
                    onCancel={handleClose}
                    fields={modalConfig.fields}
                    item={modalConfig.item}
                    onSave={modalConfig.onSave}
                    isLoading={modalConfig?.onSave?.isLoading ?? modalConfig?.isLoading}
                    serverErrors={modalConfig.serverErrors}
                    {...modalConfig}
                />
            }

        </InputModalContext.Provider>
    )
}
