import {Navigate} from "react-router";
import {useCurrentUser} from "../../hooks/useAuth.js";
import LoadingScreen from "../ui/LoadingScreen/LoadingScreen.jsx";

export default function GuestRoute({children}) {
    const {data, isLoading} = useCurrentUser();
    if (isLoading) {
        return <LoadingScreen color={"#fff"}/>
    }
    if (data?.user) {
        return <Navigate to="/login" replace/>;
    }
    return children;

}

