import {Navigate} from "react-router";
import {useCurrentUser} from "@hooks/useAuth.js";
import LoadingScreen from "../ui/LoadingScreen/LoadingScreen.jsx";

export default function GuestRoute({children}) {
    const {data, isLoading} = useCurrentUser();
    console.log('GuestRoute Debug:', {
        data: data,
        isLoading: isLoading,
        user: data?.user
    });
    if (isLoading) {
        return <LoadingScreen color={"#fff"}/>
    }
    if (data?.user) {
        return <Navigate to="/" replace/>;
    }
    return children;

}

