import {Navigate} from "react-router";
import {useCurrentUser} from "../../hooks/useAuth.js";

export default function ProtectedRoute({children, allowedRoles}) {
    const {data: user, isLoading} = useCurrentUser()
    console.log(user);

    if (isLoading) {
        return <center><h1>Loading...</h1></center>
    }
    if (!user) {
        return <Navigate to="/login" replace/>
    }
    return children;
}

