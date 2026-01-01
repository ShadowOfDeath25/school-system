import NetIncome from "@pages/NetIncome/NetIncome.jsx";
import AcademicYears from "@pages/AcademicYears/AcademicYears.jsx";

const route = {
    path: "dashboard",
    handle: {
        sidebar: {
            header: "لوحة التحكم",
            name: "dashboard"
        }
    },
    children: [
        {
            path: "net-income",
            handle: {
                sidebar: {
                    title: "صافي الدخل"
                },
                action: "view net-income"
            },
            element: <NetIncome/>
        },
        {
            path: "academic-years",
            handle: {
                sidebar: {
                    title: "الاعوام الدراسية"
                },
                action: ['view academic-years', 'create-academic-years']
            },
            element: <AcademicYears/>
        }
    ]
}
export default route
