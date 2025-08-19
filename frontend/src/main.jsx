import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
// import './index.css'
import App from './App.jsx'
import store from "./app/store.js";
import {Provider} from "react-redux";
import {RouterProvider} from "react-router";
import router from "./router.jsx"

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router}>
            <Provider store={store}>
                <App/>
            </Provider>
        </RouterProvider>
    </StrictMode>,
)
