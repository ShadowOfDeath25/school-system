import ExpenseTypes from "@pages/Expenses/ExpenseTypes.jsx";
import AddExpenses from "@pages/Expenses/AddExpenses.jsx";
import ViewExpenses from "@pages/Expenses/ViewExpenses.jsx";

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
            index: true,
            element: <ViewExpenses/>,
            handle: {
                sidebar: {
                    title: "المصروفات",
                },
                action: "view expenses"
            }
        },
        {
            path: 'add',
            element: <AddExpenses/>,
            handle: {
                sidebar: {
                    title: "اضافة حركة مصروفات",
                },
                action: "add expenses"
            }
        },
        {
            path: 'types',
            element: <ExpenseTypes/>,
            handle: {
                sidebar: {
                    title: "أنواع المصروفات",
                },
                action: "view expense-types"
            }
        }
    ]
}
export default routes
