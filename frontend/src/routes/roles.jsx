import ViewRoles from "@pages/Roles/ViewRoles.jsx";
import AddRoles from "@pages/Roles/AddRoles.jsx";

const routes =
    {
        path: "roles",
        handle: {
            sidebar: {
                header: "الصلاحيات و الرتب",
                name: "roles"
            }
        },
        children: [
            {
                index: true,
                element: <ViewRoles/>,
                handle: {
                    sidebar: {
                        title: "الرتب",
                        action: "view roles"
                    }
                }
            },
            {
                path: 'add',
                element: <AddRoles/>,
                handle: {
                    sidebar: {
                        title: "اضافة رتبة",
                        action: "create roles"
                    }
                }
            }
        ]
    }



export default routes;
