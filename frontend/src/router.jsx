import {createBrowserRouter} from "react-router";
import App from "./App.jsx";
import GuestRoute from "./components/routes/GuestRoute.jsx";
import DefaultLayout from "./components/layouts/Default/DefaultLayout.jsx";
import LoginPage from "./components/pages/Login/LoginPage.jsx";
import GuestLayout from "./components/layouts/Guest/GuestLayout.jsx";
import ProtectedRoute from "./components/routes/ProtectedRoute.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout/>,
        children: [
            {
                index: true,
                element:
                    <ProtectedRoute>
                        <App/>
                    </ProtectedRoute>
            }
        ]
    },
    {
        path: "/",
        element: <GuestLayout/>,
        children: [
            {
                path: '/login',
                element:
                    <GuestRoute>
                        <LoginPage/>
                    </GuestRoute>
            }
        ]
    }
]);
export default router;
