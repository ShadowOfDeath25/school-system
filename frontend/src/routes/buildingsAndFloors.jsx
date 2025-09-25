import AddBuilding from "@pages/BuildingsAndFloors/AddBuilding/AddBuilding.jsx";

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
            path:'add-building',
            element: <AddBuilding/>,
            handle:{
                sidebar:{
                    title:"اضافة مبني",
                    action:"create building"
                }
            }
        }
    ]
}
export default routes;
