import {createContext, useContext, useState} from 'react';
import EditModal from "@ui/EditModal/EditModal.jsx";

export const EditModalContext = createContext(null)
export const useEditModal = () => {
    const context = useContext(EditModalContext);
    if (!context) {
        throw new Error('useEditModal must be used within a EditModalProvider');
    }
    return context;
}

export function EditModalProvider({children}) {
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
        <EditModalContext.Provider value={{showEditModal,hideEditModal}}>
            {children}
            {modalConfig.open &&
                <EditModal
                    open={modalConfig.open}
                    onCancel={handleClose}
                    fields={modalConfig.fields}
                    item={modalConfig.item}
                    onSave={modalConfig.onSave}
                    isLoading={modalConfig.onSave.isLoading}
                    serverErrors={modalConfig.serverErrors}
                />
            }

        </EditModalContext.Provider>
    )
}
