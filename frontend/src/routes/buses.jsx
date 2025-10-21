import Stations from "@pages/Buses/Stations.jsx";

const routes = {
    path: 'buses',
    handle: {
        sidebar: {
            name: "buses",
            header: "السيارات"
        }
    },
    children: [
        {
            path: "stations",
            element: <Stations/>,
            handle: {
                sidebar: {
                    title: "المحطات",
                    action: "view stations"
                }
            }
        }
    ]
}
export default routes
