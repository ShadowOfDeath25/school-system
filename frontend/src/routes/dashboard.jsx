import NetIncome from "@pages/NetIncome/NetIncome.jsx";
import AcademicYears from "@pages/AcademicYears/AcademicYears.jsx";
import Dashboard from "@pages/Dashboard/Dashboard.jsx"
import TestReports from "@ui//test.jsx";


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
            index: true,
            handle: {
                sidebar: {
                    title: "لوحة التحكم"
                },
                action: "view dashboard"
            },
            element: <Dashboard />

        },
        {
            path: "net-income",
            handle: {
                sidebar: {
                    title: "صافي الدخل"
                },
                action: "view net-income"
            },
            element: <NetIncome />
        },
        {
            path: "academic-years",
            handle: {
                sidebar: {
                    title: "الاعوام الدراسية"
                },
                action: ['view academic-years', 'create-academic-years']
            },
            element: <AcademicYears />
        },
        {
            path: "test",
            handle: {
                sidebar: {
                    title: "اختبار"
                },
                action: "view test"
            },
            element: <TestReports />
        }
    ]
}
export default route
