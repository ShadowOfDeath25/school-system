import AddExamHalls from "@pages/ExamHalls/AddExamHalls.jsx";
import ExamCandidates from "@pages/ExamHalls/ExamCandidates.jsx";
import ViewExamHalls from "@pages/ExamHalls/ViewExamHalls.jsx";

const routes = {
    path: "exam-halls",
    handle: {
        sidebar: {
            header: "اللجان",
            name: "exam-halls"
        }
    },
    children: [
        {
            index: true,
            element: <ViewExamHalls/>,
            handle: {
                sidebar: {
                    title: "اللجان"
                },
                action: "view exam-halls"
            }
        },
        {
            path: "add",
            element: <AddExamHalls/>,
            handle: {
                sidebar: {
                    title: "إضافة لجنة"
                },
                action: "create exam-halls"
            }
        },
        {
            path: "exam-candidates",
            element: <ExamCandidates/>,
            handle: {
                sidebar: {
                    title: "كشف اللجان"
                },
                action: "view exam-halls"
            }
        }
    ]
}
export default routes
