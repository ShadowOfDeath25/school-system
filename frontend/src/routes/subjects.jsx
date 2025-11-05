import AddSubjects from "@pages/Subjects/AddSubjects.jsx";
import ViewSubjects from "@pages/Subjects/ViewSubjects.jsx";
import SubjectTypes from "@pages/Subjects/SubjectTypes.jsx";

const routes = {
    path: 'subjects',
    handle: {
        sidebar: {
            header: 'المواد الدراسية',
            name: 'subjects'
        }
    },
    children: [
        {
            index: true,
            element: <ViewSubjects/>,
            handle: {
                sidebar: {
                    title: "المواد الدراسية",
                },
                action: "view subjects"
            }
        },
        {
            path: 'add',
            element: <AddSubjects/>,
            handle: {
                sidebar: {
                    title: "اضافة مادة",
                },
                action: "create subject"
            }
        },
        {
            path: 'types',
            element: <SubjectTypes/>,
            handle: {
                sidebar: {
                    title: "انواع المواد",
                },
                action: "view subjects"
            }
        }
    ]
}
export default routes;
