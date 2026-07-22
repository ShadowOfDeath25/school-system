import {Outlet} from 'react-router-dom';
import {useCurrentUser} from '@hooks/api/auth.js';
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";

export default function RootLayout() {
    const {isLoading, isError, error} = useCurrentUser();

    if (isLoading) {
        return <LoadingScreen/>;
    }
    if (isError) {
        return (
            <div style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(45deg, #0F1B3A 0% 40%, #1F2F5C 100%)',
                direction: 'rtl',
            }}>
                <p style={{
                    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                    fontWeight: 500,
                    color: '#FEFFFE',
                    margin: 0,
                    textAlign: 'center',
                }}>
                    {error.response?.data?.message || error.message}
                </p>
            </div>
        );
    }
    // Todo handle server errors
    return <Outlet/>;
}
