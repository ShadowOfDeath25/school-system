import PaymentValues from "@pages/Payments/PaymentValues.jsx";
import AddPayments from "@pages/Payments/AddPayments.jsx";
import Exemptions from "@pages/Payments/Exemptions.jsx";
import BookPayments from "@pages/Payments/BookPayments.jsx";
import PaymentsPage from "@pages/Payments/PaymentsPage.jsx";
import AdministrativePayments from "@pages/Payments/AdministrativePayments.jsx";
import StudentDetailsLayout from "@layouts/StudentDetailsLayout.jsx";
import style from "@ui/Page/style.module.css";
import {Link} from 'react-router-dom'
import TuitionPayments from "@pages/Payments/TuitionPayments.jsx";
import UniformPayments from "@pages/Payments/UniformPayments.jsx";
import ExtraDues from "@pages/Payments/ExtraDues.jsx";
import AddExemptions from "@pages/Payments/AddExemptions.jsx";

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
            path: "exemption-values",
            element: <Exemptions/>,
            handle: {
                sidebar: {
                    title: "قيم الاعفائات"
                },
                action: "create exemption"
            }
        },
        {
            path: 'exemptions',
            element: <PaymentsPage route={'/payments/:id/exemptions'}/>,
            handle:{
                sidebar:{
                    title:"الاعفائات"
                },
                action:'create exemption'
            }
        },
        {
            path: "books",
            element: <PaymentsPage route={'/payments/:id/books'}/>,
            handle: {
                sidebar: {
                    title: "مدفوعات الكتب"
                },
                action: "update book-purchases",
            },

        },
        {
            path: "administrative",
            element: <PaymentsPage route={'/payments/:id/administrative'}/>,
            handle: {
                sidebar: {
                    title: "المصروفات الادارية"
                },
                action: "update payments",
            }
        },
        {
            path: "tuition",
            element: <PaymentsPage route={'/payments/:id/tuition'}/>,
            handle: {
                sidebar: {
                    title: "المصروفات الدراسية"
                },
                action: "update payments",
            }
        },
        {
            path: "uniform",
            element: <PaymentsPage route={'/payments/:id/uniforms'}/>,
            handle: {
                sidebar: {
                    title: "مصروفات الزي"
                },
                action: ["update payments", "update uniform-purchases"],
            }
        },
        {
            path: 'extra-dues',
            element: <PaymentsPage route={'/payments/:id/extra-dues'}/>,
            handle: {
                sidebar: {
                    title: "مستحقات اضافية"
                },
                action: ['create extra-dues', 'update extra-dues']
            }
        },
        {
            path: ":id",
            element: <StudentDetailsLayout/>,
            handle: {
                fallbackRedirect: "/payments",
                breadcrumbs: () => [
                    <Link className={style.breadcrumbLink} to={'/payments'}>مدفوعات التلاميذ</Link>
                ]
            },
            children: [
                {
                    path: "administrative",
                    element: <AdministrativePayments/>,
                    handle: {
                        action: "update payments",
                        title: "حركة المصروفات الادارية",
                        breadcrumbs: () => [
                            <Link className={style.breadcrumbLink} to={'/payments/administrative'}>المصروفات
                                الادارية</Link>
                        ]
                    }
                },
                {
                    path: "books",
                    element: <BookPayments/>,
                    handle: {
                        action: "update book-purchases",
                        title: "حركة مصروفات الكتب",
                        breadcrumbs: () => [
                            <Link className={style.breadcrumbLink} to={'/payments/books'}>
                                مصروفات الكتب
                            </Link>
                        ]

                    }
                },
                {
                    path: "tuition",
                    element: <TuitionPayments/>,
                    handle: {
                        action: ["update book-purchases", "update payments"],
                        title: "حركة المصروفات الدراسية",
                        breadcrumbs: () => [
                            <Link className={style.breadcrumbLink} to={'/payments/books'}>
                                المصروفات الدراسية
                            </Link>
                        ]

                    }
                },
                {
                    path: "uniforms",
                    element: <UniformPayments/>,
                    handle: {
                        action: ["update uniform-purchases", "update payments"],
                        title: "حركة مصروفات الزي",
                        breadcrumbs: () => [
                            <Link className={style.breadcrumbLink} to={'/payments/uniforms'}>
                                مصروفات الزي
                            </Link>
                        ]

                    }
                },
                {
                    path: "extra-dues",
                    element: <ExtraDues/>,
                    handle: {
                        action: ['update extra-dues', 'create extra-dues'],
                        title: "حركة المستحقات الاضافية",
                        breadcrumbs: () => [
                            <Link className={style.breadcrumbLink} to={'/payments/extra-dues'}>
                                المستحقات الاضافية
                            </Link>
                        ]
                    },
                },
                {
                    path: 'exemptions',
                    element: <AddExemptions/>,
                    handle: {
                        action: ['create exemption'],
                        title: "ادارة الاعفائات",
                        breadcrumbs: () => [
                            <Link to={'/payments/exemptions'} className={style.breadcrumbLink}>
                                الاعفائات
                            </Link>
                        ]
                    }
                }
            ]
        }
    ]
}
export default routes;
