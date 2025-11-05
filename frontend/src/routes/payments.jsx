import PaymentValues from "@pages/Payments/PaymentValues.jsx";
import AddPayments from "@pages/Payments/AddPayments.jsx";
import Exemptions from "@pages/Payments/Exemptions.jsx";

const routes = {
    path: "payments",
    handle: {
        sidebar: {
            header: "مدفوعات التلاميذ",
            name: "payments"
        }
    },
    children: [
        {
            path: "add",
            element: <AddPayments/>,
            handle: {
                sidebar: {
                    title: "اضافة مدفوعات",
                },
                action: "add payment-values"
            }
        },
        {
            path: "values",
            element: <PaymentValues/>,
            handle: {
                sidebar: {
                    title: "قيم المدفوعات",
                },
                action: "update payment-values"
            }
        },
        {
            path: "exemptions",
            element: <Exemptions/>,
            handle: {
                sidebar: {},
                action: "create exemption"
            }
        }
    ]
}
export default routes;
