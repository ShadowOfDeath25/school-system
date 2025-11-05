import AddStudents from "@pages/Students/AddStudents.jsx";
import ViewStudents from "@pages/Students/ViewStudents.jsx";
import NotEnrolled from "@pages/Students/NotEnrolled.jsx";
import Withdrawn from "@pages/Students/Withdrawn.jsx";

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
                },
                action: "view students"
            }
        },
        {
            path: "add",
            element: <AddStudents/>,
            handle: {
                sidebar: {
                    title: "إضافة تلميذ",
                },
                action: "create students"
            }
        },
        {
            path: "not-enrolled",
            element: <NotEnrolled/>,
            handle: {
                sidebar: {
                    title: "الغير مقيدون بفصول",
                },
                action: "update students"
            }
        },
        {
            path: "withdrawn",
            element: <Withdrawn/>,
            handle: {
                sidebar: {
                    title: "تلاميذ تم سحب ملفاتهم",
                },
                action: "update students"
            }
        }
    ]
}
export default routes;
