import ViewGradeAges from "@pages/GradeAges/ViewGradeAges.jsx";

const routes = {
    path: 'grade-ages',
    handle: {
        sidebar: {
            header: 'الأعمار الدراسية',
            name: 'grade-ages'
        }
    },
    children: [
        {
            index: true,
            element: <ViewGradeAges/>,
            handle: {
                sidebar: {
                    title: "إدارة الأعمار",
                },
                action: "view grade-ages"
            }
        },
    ]
}
export default routes;
