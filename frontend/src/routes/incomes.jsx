import IncomeTypes from "@pages/Incomes/IncomeTypes.jsx";

const routes = {
    path: "incomes",
    handle: {
        sidebar: {
            name: "incomes",
            header: "الايرادات"
        }
    },
    children: [
        {
            path: "types",
            element: <IncomeTypes/>,
            handle: {
                sidebar: {
                    title: "أنواع الأيرادات",
                    action: "create income-types"
                }
            }
        }
    ]


}
export default routes;
