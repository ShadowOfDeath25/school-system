import ViewRoles from "@pages/Roles/ViewRoles/ViewRoles.jsx";
import AddRoles from "@pages/Roles/AddRoles/AddRoles.jsx";

export const roles =
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



