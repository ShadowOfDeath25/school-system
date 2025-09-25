import AddBuildings from "@pages/BuildingsAndFloors/AddBuildings.jsx";
import ViewBuildings from "@pages/BuildingsAndFloors/ViewBuildings.jsx";
import AddFloors from "@pages/BuildingsAndFloors/AddFloors.jsx";
import ViewFloors from "@pages/BuildingsAndFloors/ViewFloors.jsx";
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
                sidebar: {
                    title: "المباني",
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
        },
        {
            path: 'view-floors',
            element: <ViewFloors/>,
            handle: {
                sidebar: {
                    title: "الأدوار",
                    action: "view floors"
                }
            }
        },
        {
            path: 'add-floors',
            element: <AddFloors/>,
            handle: {
                sidebar: {
                    title: "اضافة دور",
                    action: "create floors"
                }
            }
        }

    ]
}
export default routes;
