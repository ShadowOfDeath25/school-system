import {createBrowserRouter} from 'react-router-dom';
import App from './App';
import LoginPage from '@pages/Login/LoginPage';
import ProtectedRoute from '@components/guards/ProtectedRoute';
import GuestLayout from '@layouts/Guest/GuestLayout';
import DefaultLayout from '@layouts/Default/DefaultLayout';
import RootLayout from '@layouts/Root/RootLayout';
import GuestRoute from "@components/guards/GuestRoute.jsx";
import Test from "@ui/Test.jsx";
import {userRoutes} from "@routes/userRoutes.jsx";
export const routes=[
    {
        path: '/',
        element: <RootLayout/>,
        children: [
            {
                element: <ProtectedRoute/>,
                children: [
                    {
                        element: <DefaultLayout/>,
                        children: [
                            {index: true, element: <App/>},
                            {path: 'test', element: <Test/>},
                            userRoutes
                        ]
                    }
                ]
            },
            {
                element: <GuestRoute/>,
                children: [
                    {
                        path: 'login',
                        element: <GuestLayout/>,
                        children: [
                            {index: true, element: <LoginPage/>}
                        ]
                    }
                ]
            }
        ]
    }
]
const router = createBrowserRouter(routes);

export default router;
