import {Navigate} from "react-router";

export default function GuestRoute() {
    const user = false;
    if (user) {
        return <Navigate to="/" replace/>
    }
    return (
        <Outlet/>
    );
}

