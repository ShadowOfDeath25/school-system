import {useCurrentUser} from "../../hooks/useAuth.js";
import {Navigate} from 'react-router';
import LoadingScreen from "../ui/LoadingScreen/LoadingScreen.jsx";

export default function ProtectedRoute({children, allowedRoles}) {
    const {data, isLoading} = useCurrentUser();
    if (isLoading) {
        return <LoadingScreen/>
    }
    if (!data?.user) {
        return <Navigate to="/login" replace/>;
    }
    return children;
}

