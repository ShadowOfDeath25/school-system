import {Navigate} from "react-router";
import {Outlet} from 'react-router-dom';

export default function ProtectedRoute({children, allowedRoles}) {
    const user = true;

    if (!user) {
        return <Navigate to="/login" replace/>
    }
    return (
        <Outlet/>
    );
}

