import {createBrowserRouter, Navigate} from 'react-router-dom';
import LoginPage from '@pages/Login/LoginPage';
import ProtectedRoute from '@components/guards/ProtectedRoute';
import GuestLayout from '@layouts/Guest/GuestLayout';
import DefaultLayout from '@layouts/Default/DefaultLayout';
import RootLayout from '@layouts/Root/RootLayout';
import GuestRoute from "@components/guards/GuestRoute.jsx";
import { appRoutes } from '@routes/routes.jsx';
import NotFoundPage from '@pages/NotFoundPage/NotFoundPage';
import ForbiddenPage from '@pages/ForbiddenPage/ForbiddenPage';

export const routes = [
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
                            {
                              index: true,
                              element: <Navigate to={'/dashboard'}></Navigate>
                            },
                            ...appRoutes
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
            },
            {
                path: '403',
                element: <ForbiddenPage />
            }
        ]
    },
    {
        path: '*',
        element: <NotFoundPage />
    }
]
const router = createBrowserRouter(routes);

export default router;
