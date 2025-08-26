import {useCurrentUser} from "@hooks/useAuth.js";
import {Navigate} from 'react-router';
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";

export default function ProtectedRoute({children, allowedRoles}) {
    const {data, isLoading} = useCurrentUser();

    if (isLoading) {
        return <LoadingScreen/>
    }
    console.log("Protected route debug:", {
        isLoading,
        data
    })

    if (!data?.user) {
        return <Navigate to="/login"/>
    }

    return children;
}
