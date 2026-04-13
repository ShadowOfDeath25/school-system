import AddStudents from "@pages/Students/AddStudents.jsx";
import ViewStudents from "@pages/Students/ViewStudents.jsx";
import NotEnrolled from "@pages/Students/NotEnrolled.jsx";
import Withdrawn from "@pages/Students/Withdrawn.jsx";
import PromoteStudents from "@pages/PromoteStudents/PromoteStudents.jsx";
import StudentMarks from "@pages/PromoteStudents/StudentMarks.jsx";
import PickStudent from "@pages/PromoteStudents/StudentPicker.jsx";
import {Link} from "react-router-dom";
import styles from "@ui/Page/style.module.css";

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
        },
        {
            path: "promote/classrooms",
            element: <PromoteStudents/>,
            handle: {
                sidebar: {
                    title: "رصد الدرجات وترقية الطلاب"
                },
                action: "update students"
            }
        },
        {
            path: "promote/classrooms/:id",
            element: <PickStudent/>,
            handle: {
                title: "اختر طالب",
                action: "update students",

            }
        },
        {
            path: ":id/marks",
            element: <StudentMarks/>,
            handle: {
                title: "رصد درجات الطالب",
                action: "update students"
            }
        }
    ]
}
export default routes;
