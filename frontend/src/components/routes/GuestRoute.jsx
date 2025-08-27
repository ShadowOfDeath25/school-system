import {Navigate} from "react-router-dom";
import LoadingScreen from "../ui/LoadingScreen/LoadingScreen.jsx";
import {useSelector} from 'react-redux';

export default function GuestRoute({children}) {
    const authState = useSelector(state => state.auth);
    if (authState?.isLoading) {
        return <LoadingScreen color={"#fff"}/>
    }
    if (authState?.user) {
        return <Navigate to="/" replace/>;
    }
    return children;

}
