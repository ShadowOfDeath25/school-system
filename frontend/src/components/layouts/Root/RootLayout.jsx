import {Outlet} from 'react-router-dom';
import {useCurrentUser} from '@hooks/api/auth.js';
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";

export default function RootLayout() {
    const {isLoading, isError, error} = useCurrentUser();

    if (isLoading) {
        return <LoadingScreen/>;
    }
    if (isError) {
        return <h1>{error.message}</h1>
    }
    // Todo handle server errors
    return <Outlet/>;
}
