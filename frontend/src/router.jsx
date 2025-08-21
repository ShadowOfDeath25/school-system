import {createBrowserRouter} from "react-router";
import ProtectedRoute from "./components/routes/ProtectedRoute.jsx";
import App from "./App.jsx";
import GuestRoute from "./components/routes/GuestRoute.jsx";
import DefaultLayout from "./components/layouts/DefaultLayout/DefaultLayout.jsx";

const router = createBrowserRouter([
    {
        path:'/',
        element: <DefaultLayout/>,
        children: [
            {
                index:true,
                element: <App/>
            }
        ]
    },
    {
        path: "/",
        element: <GuestRoute/>
    }
]);
export default router;
