import {Navigate} from "react-router-dom";
import LoadingScreen from "../ui/LoadingScreen/LoadingScreen.jsx";
import {useCurrentUser} from "@hooks/useAuth.js";

export default function GuestRoute({children}) {
    const {data, isLoading} = useCurrentUser()
    if (isLoading) {
        return <LoadingScreen color={"#fff"}/>
    }
    if (data?.user) {
        return <Navigate to="/" replace/>;
    }
    return children;

}
