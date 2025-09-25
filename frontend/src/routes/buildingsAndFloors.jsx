import AddBuildings from "@pages/BuildingsAndFloors/AddBuildings.jsx";
import ViewBuildings from "@pages/BuildingsAndFloors/ViewBuildings.jsx";
// import AddBuildings from "@pages/BuildingsAndFloors/AddBuildings/AddBuildings.jsx";

const routes = {
    path: 'buildingsAndFloors',
    handle: {
        sidebar: {
            header: 'المباني و الأدوار',
            name: 'buildingsAndFloors'
        }
    },
    children: [
        {
            path: 'view-buildings',
            element: <ViewBuildings/>,
            handle: {
                sidebar:{
                    title:"المباني",
                    action: "view buildings"
                }
            }
        },
        {
            path: 'add-buildings',
            element: <AddBuildings/>,
            handle: {
                sidebar: {
                    title: "اضافة مبني",
                    action: "create buildings"
                }
            }
        }

    ]
}
export default routes;
