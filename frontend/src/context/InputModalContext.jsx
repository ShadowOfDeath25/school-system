import {createContext, useContext, useState} from 'react';
import InputModal from "@ui/InputModal/InputModal.jsx";

export const InputModalContext = createContext(null)
export const useInputModal = () => {
    const context = useContext(InputModalContext);
    if (!context) {
        throw new Error('useEditModal must be used within a EditModalProvider');
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
    const showEditModal = (config) => {
        setModalConfig({
            ...config,
            open: true,
            serverErrors: null,
        })
    }
    const hideEditModal = ()=>{
        setModalConfig({open: false, fields: [], item: null, resource: "", serverErrors: null});
    }


    return (
        <InputModalContext.Provider value={{showEditModal,hideEditModal}}>
            {children}
            {modalConfig.open &&
                <InputModal
                    open={modalConfig.open}
                    onCancel={handleClose}
                    fields={modalConfig.fields}
                    item={modalConfig.item}
                    onSave={modalConfig.onSave}
                    isLoading={modalConfig.onSave.isLoading}
                    serverErrors={modalConfig.serverErrors}
                />
            }

        </InputModalContext.Provider>
    )
}
