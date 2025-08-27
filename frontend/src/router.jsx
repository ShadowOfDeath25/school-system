// frontend/src/router.jsx
import {createBrowserRouter} from 'react-router-dom';
import App from './App';
import LoginPage from './components/pages/Login/LoginPage';
import ProtectedRoute from './components/routes/ProtectedRoute';
import GuestLayout from './components/layouts/Guest/GuestLayout';
import DefaultLayout from './components/layouts/Default/DefaultLayout';
import RootLayout from './components/layouts/Root/RootLayout';
import GuestRoute from "./components/routes/GuestRoute.jsx";
import Test from "@ui/Test.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout/>,
        children: [
            {
                // Authenticated routes are rendered within the DefaultLayout
                element: <DefaultLayout/>,
                children: [
                    {
                        index: true, // Matches the parent route path ('/')
                        element: (
                            <ProtectedRoute>
                                <App/>
                            </ProtectedRoute>
                        )
                    },
                    {
                        path: 'test',
                        element: (
                            <ProtectedRoute>
                                <Test/>
                            </ProtectedRoute>
                        )
                    }
                ]
            },
            {
                // Guest-only routes are rendered within the GuestLayout
                element: <GuestLayout/>,
                children: [
                    {
                        path: 'login',
                        element: <GuestRoute><LoginPage/></GuestRoute>
                    }
                ]
            }
        ]
    }
]);

export default router;
