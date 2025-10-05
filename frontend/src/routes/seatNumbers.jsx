import ViewSeatNumbers from "@pages/SeatNumbers/ViewSeatNumbers.jsx";
import AddSeatNumbers from "@pages/SeatNumbers/AddSeatNumbers.jsx";

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
                    action: "view seat-numbers"
                }
            }
        },
        {
            path: 'add',
            element: <AddSeatNumbers/>,
            handle: {
                sidebar: {
                    title: "اضافة ارقام الجلوس",
                    action: "create seat-numbers"
                }
            }
        }
    ]
}
export default routes
