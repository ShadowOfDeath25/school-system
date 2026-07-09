import PromotionDashboard from "@pages/PromoteStudents/PromotionDashboard.jsx";
import BatchHistory from "@pages/PromoteStudents/BatchHistory.jsx";
import GraduationReport from "@pages/PromoteStudents/GraduationReport.jsx";

const routes = {
    path: "promotion",
    handle: {
        sidebar: {
            header: "النظام",
            name: "promotion",
        },
    },
    children: [
        {
            index: true,
            element: <PromotionDashboard />,
            handle: {
                sidebar: {
                    title: "الترقية",
                },
                action: "view promotion",
            },
        },
        {
            path: "batches",
            element: <BatchHistory />,
            handle: {
                sidebar: {
                    title: "سجل الترقيات",
                },
                action: "view promotion",
            },
        },
        {
            path: "graduation/:batchId",
            element: <GraduationReport />,
            handle: {
                sidebar: {
                    title: "تقارير التخرج",
                    hidden: true,
                },
                action: "view promotion",
            },
        },
    ],
};

export default routes;
