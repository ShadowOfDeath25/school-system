import { createContext, useContext, useState } from 'react';
import PDFPreviewModal from '@ui/PDFPreviewModal/PDFPreviewModal.jsx';

export const PDFPreviewContext = createContext(null);

export const usePDFPreview = () => {
    const context = useContext(PDFPreviewContext);
    if (!context) {
        throw new Error('usePDFPreview must be used within a PDFPreviewProvider');
    }
    return context;
};

export function PDFPreviewProvider({ children }) {
    const [modalConfig, setModalConfig] = useState({
        open: false,
        url: null,
        title: "معاينة الملف"
    });

    const showPDFPreview = ({ url, title = "معاينة الملف" }) => {
        setModalConfig({
            open: true,
            url,
            title
        });
    };

    const hidePDFPreview = () => {
        setModalConfig({
            open: false,
            url: null,
            title: "معاينة الملف"
        });
    };

    return (
        <PDFPreviewContext.Provider value={{ showPDFPreview, hidePDFPreview }}>
            {children}
            {modalConfig.open && (
                <PDFPreviewModal
                    open={modalConfig.open}
                    onClose={hidePDFPreview}
                    url={modalConfig.url}
                    title={modalConfig.title}
                />
            )}
        </PDFPreviewContext.Provider>
    );
}
