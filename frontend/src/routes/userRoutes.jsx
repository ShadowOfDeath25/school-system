import React from 'react';
import ViewUsers from "@pages/Users/ViewUsers/ViewUsers.jsx";
import AddUser from "@pages/Users/AddUsers/AddUsers.jsx";
import AddRoles from "@pages/Users/AddRoles/AddRoles.jsx";


export const userRoutes = {
    path: 'users',
    handle: {
        sidebar: {
            header: 'المستخدمين',
            name: 'users',
        }
    },
    children: [
        {
            index: true,
            element: <ViewUsers/>,
            handle: {
                sidebar: {
                    title: 'عرض المستخدمين',
                    action: 'view users',
                }
            }
        },
        {
            path: 'add',
            element: <AddUser/>,
            handle: {
                sidebar: {
                    title: 'اضافة مستخدم',
                    action: 'create users',
                }
            }
        },
        {
            path: 'roles/add',
            element: <AddRoles/>,
            handle: {
                sidebar: {
                    title: "اضافة صلاحيات",
                    action: "create roles"
                }
            }
        }
    ]
};
