import AddClassrooms from "@pages/Classrooms/AddClassrooms/AddClassrooms.jsx";

const routes = {
    path: "classrooms",
    handle: {
        sidebar:{
            header: "الفصول",
            name: "classrooms",
        }
    },
    children: [
        {
            path:'add',
            element: <AddClassrooms/>,
            handle:{
                sidebar:{
                    title:"اضافة فصل",
                    action: "create classrooms"
                }
            }
        }
    ]
}
export default routes
