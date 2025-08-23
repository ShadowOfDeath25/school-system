import './index.css';
import {useLogout} from "./hooks/useAuth.js";


function App() {
    const logoutMutation = useLogout()
    const handleLogout = (e) => {
        e.preventDefault();
        logoutMutation.mutate();
    }
    return (
        <>
            <center>
                <button onClick={handleLogout}>Logout</button>
            </center>
        </>
    )
}

export default App
