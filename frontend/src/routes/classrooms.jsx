import AddClassrooms from "@pages/Classrooms/AddClassrooms.jsx";
import ViewClassrooms from "@pages/Classrooms/ViewClassrooms.jsx";

const routes = {
    path: "classrooms",
    handle: {
        sidebar: {
            header: "الفصول",
            name: "classrooms",
        }
    },
    children: [
        {
            index: true,
            element: <ViewClassrooms/>,
            handle: {
                sidebar: {
                    title: "الفصول",
                },
                action: "view classrooms"
            }

        },
        {
            path: 'add',
            element: <AddClassrooms/>,
            handle: {
                sidebar: {
                    title: "اضافة فصل",
                },
                action: "create classrooms"
            }
        }
    ]
}
export default routes
