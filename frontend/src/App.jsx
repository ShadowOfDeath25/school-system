import './index.css';
import {useLogout} from "./hooks/useAuth.js";


function App() {
    console.log("This is text from the app component");
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
