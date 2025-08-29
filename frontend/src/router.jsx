import {createBrowserRouter} from 'react-router-dom';
import App from './App';
import LoginPage from '@pages/Login/LoginPage';
import ProtectedRoute from '@routes/ProtectedRoute';
import GuestLayout from '@layouts/Guest/GuestLayout';
import DefaultLayout from '@layouts/Default/DefaultLayout';
import RootLayout from '@layouts/Root/RootLayout';
import GuestRoute from "@routes/GuestRoute.jsx";
import Test from "@ui/Test.jsx";
import AddUsers from "@pages/Users/AddUsers.jsx";
const router = createBrowserRouter([
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
                            {path: 'test', element: <Test/>}
                        ]
                    }
                ]
            },
            {
                // Sibling group for ADMIN-ONLY routes
                element: <ProtectedRoute allowedRoles={['admin']}/>,
                children: [
                    {
                        element: <DefaultLayout/>,
                        children: [
                            {path: '/users/add', element: <AddUsers/>}
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
]);

export default router;
