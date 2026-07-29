import AddBankAccounts from "@pages/BankAccounts/AddBankAccounts.jsx";
import ViewBankAccounts from "@pages/BankAccounts/ViewBankAccounts.jsx";
import BankAccountReport from "@pages/BankAccounts/BankAccountReport.jsx";

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
        },
        {
            path: "report",
            element: <BankAccountReport/>,
            handle: {
                sidebar: {
                    title: "تقرير الحسابات البنكية",
                },
                action: "view bank-accounts"
            }
        }
    ]
}
export default routes
