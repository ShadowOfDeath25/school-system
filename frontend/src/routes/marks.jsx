import MarksIndex from "@pages/Marks/ClassroomPicker.jsx";
import RecordMarks from "@pages/Marks/RecordMarks/RecordMarks.jsx";

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
            path: "record/:studentId",
            element: <RecordMarks />,
            handle: {
                title: "تسجيل الدرجات",
                action: "update marks",
            },
        },
    ],
};

export default routes;
