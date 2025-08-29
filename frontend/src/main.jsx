import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {RouterProvider} from "react-router";
import router from "./router.jsx"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import './fonts.css'
import './index.css'
const queryClient = new QueryClient();
window.__TANSTACK_QUERY_CLIENT__ = queryClient;
createRoot(document.getElementById('root')).render(
    <StrictMode>

        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}/>
        </QueryClientProvider>

    </StrictMode>,
)
