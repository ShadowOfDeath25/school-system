import AddBankAccounts from "@pages/BankAccounts/AddBankAccounts.jsx";
import ViewBankAccounts from "@pages/BankAccounts/ViewBankAccounts.jsx";

const routes = {
    path: "bank-accounts",
    handle: {
        sidebar: {
            name: "bank-accounts",
            header: "الحسابات البنكية"
        }
    },
    children: [
        {
            index: true,
            element: <ViewBankAccounts/>,
            handle: {
                sidebar: {
                    title: "الحسابات البنكية",
                },
                action: "view bank-accounts"
            }
        },
        {
            path: "add",
            element: <AddBankAccounts/>,
            handle: {
                sidebar: {
                    title: "اضافة حركة",
                },
                action: "create bank-accounts"
            }
        }
    ]
}
export default routes
