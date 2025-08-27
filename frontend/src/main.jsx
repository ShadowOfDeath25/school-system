import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import store from "./app/store.js";
import {Provider} from "react-redux";
import {RouterProvider} from "react-router";
import router from "./router.jsx"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
    // <StrictMode>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router}/>
            </QueryClientProvider>
        </Provider>
    // </StrictMode>,
)
