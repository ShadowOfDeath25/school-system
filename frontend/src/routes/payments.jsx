import PaymentValues from "@pages/Payments/PaymentValues.jsx";
import AddPayments from "@pages/Payments/AddPayments.jsx";
import Exemptions from "@pages/Payments/Exemptions.jsx";
import BookPayments from "@pages/Payments/BookPayments.jsx";
import PaymentsPage from "@pages/Payments/PaymentsPage.jsx";
import AdministrativePayments from "@pages/Payments/AdministrativePayments.jsx";

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
                sidebar: {
                    title: "الاعفائات"
                },
                action: "create exemption"
            }
        },
        {
            path: "books",
            element: <PaymentsPage route={'/payments/books/:id'}/>,
            handle: {
                sidebar: {
                    title: "مدفوعات الكتب"
                },
                action: "update book-purchases",
            },

        },
        {
            path: "books/:id",
            element: <BookPayments/>,
            handle: {
                action: "update book-purchases",
                title: "حركة مصروفات الكتب"
            }
        },
        {
            path: "administrative",
            element: <PaymentsPage route={'/payments/administrative/:id'}/>,
            handle: {
                sidebar: {
                    title: "المصروفات الادارية"
                },
                action: "update payments",
            }
        },
        {
            path: "administrative/:id",
            element: <AdministrativePayments/>,
            handle: {
                action: "update payments",
                title: "حركة المصروفات الادارية"
            }
        }
    ]
}
export default routes;
