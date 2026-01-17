import { createContext, useContext, useState, useEffect } from 'react';
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

    const showPDFPreview = ({ children, title = "معاينة الملف" }) => {
        setModalConfig({
            open: true,
            children,
            title
        });
    };

    const hidePDFPreview = () => {
        setModalConfig({
            open: false,
            children: null,
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
                    title={modalConfig.title}
                    logo={logoBase64}
                >
                    {modalConfig.children}
                </PDFPreviewModal>
            )}
        </PDFPreviewContext.Provider>
    );
}
