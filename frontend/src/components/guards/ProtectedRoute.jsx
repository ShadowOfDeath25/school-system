import {Navigate, Outlet, useMatches} from 'react-router-dom';
import {useCurrentUser} from '@hooks/api/auth';
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";

export default function ProtectedRoute() {
    const {data: user, isLoading} = useCurrentUser();
    const matches = useMatches();
    const currentRoute = matches[matches.length - 1];
    const requiredPermission = currentRoute.handle?.permission;

    if (isLoading) {
        return <LoadingScreen/>;
    }

    if (!user) {

        return <Navigate to="/login" replace/>;
    }

    const hasPermission = requiredPermission ? (user.role.includes("Super Admin")||user.permissions.includes(requiredPermission)) : true;

    if ( !hasPermission) {
        return <Navigate to="/" replace/>;
    }


    return <Outlet/>;
}
