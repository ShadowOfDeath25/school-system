import IncomeTypes from "@pages/Incomes/IncomeTypes.jsx";
import AddIncome from "@pages/Incomes/AddIncome.jsx";
import ViewIncomes from "@pages/Incomes/ViewIncomes.jsx";

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
            index: true,
            element: <ViewIncomes/>,
            handle: {
                sidebar: {
                    title: "عرض الأيرادات",
                },
                action: "view incomes"
            }
        },
        {
            path: "add",
            element: <AddIncome/>,
            handle: {
                sidebar: {
                    title: "اضافة حركة ايرادات",
                },
                action: "create incomes"
            }
        },
        {
            path: "types",
            element: <IncomeTypes/>,
            handle: {
                sidebar: {
                    title: "أنواع الأيرادات",
                },
                action: "create income-types"
            }
        }
    ]


}
export default routes;
