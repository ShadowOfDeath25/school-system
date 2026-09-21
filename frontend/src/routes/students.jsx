import AddStudents from "@pages/Students/AddStudents.jsx";
import ViewStudents from "@pages/Students/ViewStudents.jsx";
import NotEnrolled from "@pages/Students/NotEnrolled.jsx";
import Withdrawn from "@pages/Students/Withdrawn.jsx";
import StudentReports from "@pages/StudentReports/StudentReports.jsx";
import ViewNoteTypes from "@pages/NoteTypes/ViewNoteTypes.jsx";
import ViewGradeAges from "@pages/GradeAges/ViewGradeAges.jsx";
import TransferOut from "@pages/Transfers/TransferOut.jsx";
import TransferHistory from "@pages/Transfers/TransferHistory.jsx";
import StudentDetailsLayout from "@layouts/StudentDetailsLayout.jsx";
import style from "@ui/Page/style.module.css";
import { Link } from "react-router-dom";


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
            path: ":id",
            element: <StudentDetailsLayout/>,
            handle: {
                fallbackRedirect: "/students",
                breadcrumbs: () => [
                    <Link className={style.breadcrumbLink} to={'/students'}>التلاميذ</Link>
                ]
            }
        },
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
            path: "grade-ages",
            element: <ViewGradeAges/>,
            handle: {
                sidebar: {
                    title: "الحد الادني للأعمار",
                },
                action: "view grade-ages"
            }
        },
        {
            path: "notes",
            element: <ViewNoteTypes/>,
            handle: {
                sidebar: {
                    title: "العلامات المميزة",
                },
                action: "view note-types"
            }
        },
        {
            path: "reports",
            element: <StudentReports/>,
            handle: {
                sidebar: {title: "التقارير"},
                action: "view student-reports"
            }
        },
        {
            path: "transfers/outgoing",
            element: <TransferOut/>,
            handle: {
                sidebar: {
                    title: "تحويل من المدرسة",
                },
                action: "transfer students"
            }
        },
        {
            path: "transfers/history",
            element: <TransferHistory/>,
            handle: {
                sidebar: {
                    title: "سجل التحويلات",
                },
                action: "transfer students"
            }
        },

    ]
}
export default routes;
