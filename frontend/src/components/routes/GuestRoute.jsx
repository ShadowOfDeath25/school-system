import {Navigate} from "react-router";
import {useCurrentUser} from "../../hooks/useAuth.js";
import {Suspense} from "react";

export default function GuestRoute({children}) {
    const {data: user, isLoading} = useCurrentUser()
    console.log(user);
    if (user) {
        return <Navigate to="/" replace/>
    }
    return children;

}

