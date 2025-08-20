import Sidebar from "../Sidebar/Sidebar.jsx";

export default function DefaultLayout() {
    return (
        <>
            <div className="container">
                <div className="content"></div>
                <Sidebar/>
            </div>
        </>
    );
}

