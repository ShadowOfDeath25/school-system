import AddStudents from "@pages/Students/AddStudents.jsx";
import ViewStudents from "@pages/Students/ViewStudents.jsx";

const routes = {
    path: "students",
    handle: {
        sidebar: {
            header: "التلاميذ",
            name: "students"
        }
    },
    children: [
        {
            index: true,
            element: <ViewStudents/>,
            handle: {
                sidebar: {
                    title: "التلاميذ",
                    action: "view students"
                }
            }
        },
        {
            path: "add",
            element: <AddStudents/>,
            handle: {
                sidebar: {
                    title: "إضافة تلميذ",
                    action: "create students"
                }
            }
        }
    ]
}
export default routes;
