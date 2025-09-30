import AddSubject from "@pages/Subjects/AddSubject.jsx";

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
            path: 'add',
            element: <AddSubject/>,
            handle: {
                sidebar: {
                    title: "اضافة مادة",
                    action: "create subject"
                }
            }
        }
    ]
}
export default routes;
