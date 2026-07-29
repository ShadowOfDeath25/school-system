import AddExams from "@pages/Exams/AddExams.jsx";
import ViewExams from "@pages/Exams/ViewExams.jsx";
import ExamTimetable from "@pages/ExamReports/ExamTimetable.jsx";

const routes = {
    path: "exams",
    handle: {
        sidebar: {
            header: "الاختبارات",
            name: "exams"
        }
    },
    children: [
        {
            index: true,
            element: <ViewExams/>,
            handle: {
                sidebar: {
                    title: "الاختبارات",
                },
                action: "view exams"
            }
        },
        {
            path: "add",
            element: <AddExams/>,
            handle: {
                sidebar: {
                    title: "اضافة اختبار",
                },
                action: "create exams"
            }
        },
        {
            path: "timetable",
            element: <ExamTimetable />,
            handle: {
                sidebar: {
                    title: "جدول الامتحانات",
                },
                action: "view student-reports",
            },
        },
    ]
}
export default routes;
