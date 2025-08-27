import {Outlet} from 'react-router-dom';
import {useCurrentUser} from '@hooks/useAuth';
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {logout, setUser} from "@features/Auth/authSlice.js";

export default function RootLayout() {
    const {data, isLoading, isSuccess, isError} = useCurrentUser();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isSuccess && data) {
            dispatch(setUser(data));
        } else if (isError) {
            dispatch(logout());
        }
    }, [isSuccess, isError, data, dispatch]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return <Outlet/>;
}
