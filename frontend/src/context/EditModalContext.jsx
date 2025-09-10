import {createContext, useContext, useState} from 'react';
import EditModal from "@ui/EditModal/EditModal.jsx";
import {useUpdate} from "@hooks/api/useCrud.js";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";

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
    const {showSnackbar} = useSnackbar();

    const updateMutation = useUpdate(modalConfig.resource, {
        onSuccess: () => {
            showSnackbar("تم تحديث العنصر بنجاح");
            handleClose();
        },
        onError: (error) => {
            setModalConfig(prev => ({...prev, serverErrors: error.response?.data?.errors || {}}));
            showSnackbar("حدث خطأ أثناء تحديث العنصر", "error");
        }
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

    const handleSave = (formData) => {
        updateMutation.mutate(formData);
        console.log(formData);
    };

    return (
        <EditModalContext.Provider value={{showEditModal}}>
            {children}
            {modalConfig.open &&
                <EditModal
                    open={modalConfig.open}
                    onCancel={handleClose}
                    fields={modalConfig.fields}
                    item={modalConfig.item}
                    onSave={handleSave}
                    isLoading={updateMutation.isLoading}
                    serverErrors={modalConfig.serverErrors}
                />
            }

        </EditModalContext.Provider>
    )
}
