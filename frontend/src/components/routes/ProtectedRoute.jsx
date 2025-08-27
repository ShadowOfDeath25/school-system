import {Navigate} from 'react-router-dom';
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import {useSelector} from "react-redux";

export default function ProtectedRoute({children, allowedRoles}) {
    const authState = useSelector((state) => state.auth);

    if (authState?.isLoading) {
        return <LoadingScreen />;
    }

    if (!authState?.user) {
        return <Navigate to="/login" replace />;
    }

    // Optional: Role-based access control can be added here later
    // if (allowedRoles && !allowedRoles.includes(authState.user.role)) {
    //     return <Navigate to="/unauthorized" replace />;
    // }

    return children;
}
