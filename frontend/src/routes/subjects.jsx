import AddSubject from "@pages/Subjects/AddSubject.jsx";
import ViewSubjects from "@pages/Subjects/ViewSubjects.jsx";
import SubjectTypes from "@pages/Subjects/SubjectTypes.jsx";

const routes = {
    path: 'subjects',
    handle: {
        sidebar: {
            header: 'المواد',
            name: 'subjects'
        }
    },
    children: [
        {
            index: true,
            element: <ViewSubjects/>,
            handle: {
                sidebar: {
                    title: "المواد",
                    action: "view subjects"
                }
            }
        },
        {
            path: 'add',
            element: <AddSubject/>,
            handle: {
                sidebar: {
                    title: "اضافة مادة",
                    action: "create subject"
                }
            }
        },
        {
            path: 'types',
            element: <SubjectTypes/>,
            handle: {
                sidebar: {
                    title: "انواع المواد",
                    action: "view subjects"
                }
            }
        }
    ]
}
export default routes;
