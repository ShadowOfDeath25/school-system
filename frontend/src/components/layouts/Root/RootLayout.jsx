import {Outlet} from 'react-router-dom';
import {useCurrentUser} from '@hooks/api/auth.js';
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";

export default function RootLayout() {
    const { isLoading, isError} = useCurrentUser();

    if (isLoading) {
        return <LoadingScreen/>;
    }
    // Todo handle server errors
    return <Outlet/>;
}
