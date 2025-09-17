import AddStudents from "@pages/Students/AddStudents/AddStudents.jsx";
import ViewStudents from "@pages/Students/ViewStudents/ViewStudents.jsx";

export const students = {
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
