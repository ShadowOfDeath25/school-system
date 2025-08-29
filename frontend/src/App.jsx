import './index.css';
import {useLogout} from "@hooks/api/auth.js";

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
