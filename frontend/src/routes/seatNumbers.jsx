import ViewSeatNumbers from "@pages/SeatNumbers/ViewSeatNumbers.jsx";
import AddSeatNumbers from "@pages/SeatNumbers/AddSeatNumbers.jsx";
import ViewSeatAssignments from "@pages/SeatNumbers/ViewSeatAssignments.jsx";

const routes = {
    path: 'seat-numbers',
    handle: {
        sidebar: {
            name: "seat-numbers",
            header: "ارقام الجلوس"
        },

    },
    children: [
        {
            index: true,
            element: <ViewSeatNumbers/>,
            handle: {
                sidebar: {
                    title: "ارقام الجلوس",
                },
                action: "view seat-numbers"
            }
        },
        {
            path: 'add',
            element: <AddSeatNumbers/>,
            handle: {
                sidebar: {
                    title: "اضافة ارقام الجلوس",
                },
                action: "create seat-numbers"
            }
        },
        {
            path: 'assignments',
            element: <ViewSeatAssignments/>,
            handle: {
                sidebar: {
                    title: "توزيع أرقام الجلوس",
                },
                action: "view seat-numbers"
            }
        }
    ]
}
export default routes
