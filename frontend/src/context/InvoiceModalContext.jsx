import { createContext, useContext, useState, useEffect } from 'react';
import InvoiceModal from '@ui/InvoiceModal/InvoiceModal.jsx';

export const InvoiceModalContext = createContext(null);

export const useInvoiceModal = () => {
    const context = useContext(InvoiceModalContext);
    if (!context) {
        throw new Error('useInvoiceModal must be used within an InvoiceModalProvider');
    }
    return context;
};

export function InvoiceModalProvider({ children }) {
    const [modalConfig, setModalConfig] = useState({
        open: false,
        children: null,
        title: "معاينة الملف"
    });
    const [logoBase64, setLogoBase64] = useState(null);

    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = '/logo.svg';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
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
        };
    }, []);

    const showInvoiceModal = ({ children, title = "معاينة الملف" }) => {
        setModalConfig({
            open: true,
            children,
            title
        });
    };

    const hideInvoiceModal = () => {
        setModalConfig({
            open: false,
            children: null,
            title: "معاينة الملف"
        });
    };

    return (
        <InvoiceModalContext.Provider value={{ showInvoiceModal, hideInvoiceModal }}>
            {children}
            {modalConfig.open && (
                <InvoiceModal
                    open={modalConfig.open}
                    onClose={hideInvoiceModal}
                    title={modalConfig.title}
                    logo={logoBase64}
                >
                    {modalConfig.children}
                </InvoiceModal>
            )}
        </InvoiceModalContext.Provider>
    );
}
