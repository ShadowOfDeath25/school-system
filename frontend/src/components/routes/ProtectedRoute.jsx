import {Navigate, Outlet} from 'react-router-dom';
import {useCurrentUser} from "@hooks/api/auth.js";

export default function ProtectedRoute({ allowedRoles }) {
    const {data} = useCurrentUser();
    const user = data?.user;

    if (!user) {
        return <Navigate to="/login" replace/>;
    }

    // If allowedRoles are provided, check if the user's role is included.
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to an "unauthorized" page or the main dashboard.
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
