import PaymentValues from "@pages/Payments/PaymentValues.jsx";
import AddPayments from "@pages/Payments/AddPayments.jsx";

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
                    action: "add payment-values"
                }
            }
        },
        {
            path: "values",
            element: <PaymentValues/>,
            handle: {
                sidebar: {
                    title: "قيم المدفوعات",
                    action: "update payment-values"
                }
            }
        }
    ]
}
export default routes;
