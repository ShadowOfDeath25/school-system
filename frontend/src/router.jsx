// frontend/src/router.jsx
import {createBrowserRouter} from 'react-router-dom';
import App from './App';
import LoginPage from './components/pages/Login/LoginPage';
import ProtectedRoute from './components/routes/ProtectedRoute';
import GuestLayout from './components/layouts/Guest/GuestLayout';
import DefaultLayout from './components/layouts/Default/DefaultLayout';
import RootLayout from './components/layouts/Root/RootLayout';
import GuestRoute from "./components/routes/GuestRoute.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout/>,
        children: [
            {
                path: '',
                element: <DefaultLayout/>,
                children: [
                    {
                        path: '',
                        element: (
                            <ProtectedRoute>
                                <App/>
                            </ProtectedRoute>
                        )
                    }
                ]
            },
            {
                path: '',
                element: <GuestLayout/>,
                children: [
                    {
                        path: 'login',
                        element:
                            <GuestRoute>
                                <LoginPage/>
                            </GuestRoute>
                    }
                ]
            }
        ]
    }
]);

export default router;
