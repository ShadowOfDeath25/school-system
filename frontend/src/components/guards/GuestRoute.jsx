import {Navigate, Outlet} from "react-router-dom";
import {useCurrentUser} from "@hooks/api/auth.js";

export default function GuestRoute() {
    const {data: user} = useCurrentUser();

    if (user) {
        return <Navigate to="/" replace/>;
    }
    return <Outlet/>;
}
