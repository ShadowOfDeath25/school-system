import ViewUsers from "@pages/Users/ViewUsers/ViewUsers.jsx";
import AddUser from "@pages/Users/AddUsers/AddUsers.jsx";

export const userRoutes={
    path:'users',
    children: [
        {
            index:true,
            element: <ViewUsers/>,
            handle: {permission:'view users'}
        },
        {
            path:'add',
            element: <AddUser/>,
            handle: {permission:'create users'}
        }
    ]
}
