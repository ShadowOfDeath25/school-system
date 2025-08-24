// frontend/src/components/layouts/Root/RootLayout.jsx
import {Outlet} from 'react-router-dom';
import {useCurrentUser} from '../../../hooks/useAuth';

export default function RootLayout() {
    const {data: user} = useCurrentUser();

    return <Outlet/>;
}
