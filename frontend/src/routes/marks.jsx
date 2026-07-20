import MarksIndex from "@pages/Marks/ClassroomPicker.jsx";
import RecordMarks from "@pages/Marks/RecordMarks/RecordMarks.jsx";
import SecondRoundStudents from "@pages/Marks/SecondRoundStudents.jsx";
import MarksReports from "@pages/Marks/MarksReports/MarksReports.jsx";

const routes = {
    path: "marks",
    handle: {
        sidebar: {
            header: "الدرجات",
            name: "marks",
        },
    },
    children: [
        {
            index: true,
            element: <MarksIndex />,
            handle: {
                sidebar: { title: "تسجيل الدرجات" },
                action: "view marks",
            },
        },
        {
            path: "second-round",
            element: <SecondRoundStudents />,
            handle: {
                sidebar: { title: "دور ثاني" },
                action: "view marks",
            },
        },
        {
            path: "record/:studentId",
            element: <RecordMarks />,
            handle: {
                title: "تسجيل الدرجات",
                action: "update marks",
            },
        },
        {
            path: "marks-report",
            element: <MarksReports />,
            handle: {
                sidebar: { title: "تقارير الدرجات" },
                action: "view student-reports",
            },
        },
    ],
};

export default routes;
