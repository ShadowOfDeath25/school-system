import PaymentValues from '@pages/Payments/PaymentValues.jsx'

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
            path: "values",
            element: <PaymentValues/>,
            handle: {
                sidebar: {
                    title: "قيم المدفوعات",
                    action: "update payments"
                }
            }
        }
    ]
}
export default routes;
