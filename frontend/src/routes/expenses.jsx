import ExpenseTypes from "@pages/Expenses/ExpenseTypes.jsx";
import AddExpenses from "@pages/Expenses/AddExpenses.jsx";

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
            path: 'add',
            element: <AddExpenses/>,
            handle: {
                sidebar: {
                    title: "اضافة حركة مصروفات",
                    action: "add expense"
                }
            }
        },
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
