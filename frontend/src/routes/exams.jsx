import AddExams from "@pages/Exams/AddExams.jsx";

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
            path: "add",
            element: <AddExams/>,
            handle: {
                sidebar: {
                    title: "اضافة اختبار",
                    action: "create exams"
                }
            }
        },

    ]
}
export default routes;
