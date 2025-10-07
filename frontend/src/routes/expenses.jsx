import ExpenseTypes from "@pages/Expenses/ExpenseTypes.jsx";

const routes = {
    path: 'expenses',
    handle: {
        sidebar: {
            header: "المصروفات",
            name: "expenses"
        }
    },
    children: [
        {
            path: 'types',
            element: <ExpenseTypes/>,
            handle: {
                sidebar: {
                    title: "أنواع المصروفات",
                    action: "view expense-types"
                }
            }
        }
    ]
}
export default routes
