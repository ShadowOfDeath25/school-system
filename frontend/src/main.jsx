import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router";
import router from "./router.jsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './fonts.css'
import './index.css'
import { SnackbarProvider } from '@contexts/SnackbarContext.jsx'
import { ConfirmModalProvider } from "@contexts/ConfirmModalContext.jsx";
import './i18n'
import { InputModalProvider } from "@contexts/InputModalContext.jsx";
import { PDFPreviewProvider } from "@contexts/PDFPreviewContext.jsx";
import { InvoiceModalProvider } from "@contexts/InvoiceModalContext.jsx";
import '@utils/arrayExtensions.js'
const queryClient = new QueryClient();
window.__TANSTACK_QUERY_CLIENT__ = queryClient;
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <SnackbarProvider>
                <ConfirmModalProvider>
                    <InputModalProvider>
                        <PDFPreviewProvider>
                            <InvoiceModalProvider>
                                <RouterProvider router={router} />
                            </InvoiceModalProvider>
                        </PDFPreviewProvider>
                    </InputModalProvider>
                </ConfirmModalProvider>
            </SnackbarProvider>
        </QueryClientProvider>
    </StrictMode>,
)
