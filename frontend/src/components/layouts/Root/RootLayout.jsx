import {Outlet} from 'react-router-dom';
import {useCurrentUser} from '@hooks/useAuth';
import LoadingScreen from "../../ui/LoadingScreen/LoadingScreen.jsx";

export default function RootLayout() {
    const {data: user,isLoading} = useCurrentUser();
    if (isLoading){
        return <LoadingScreen/>;
    }
    return <Outlet/>;
}
