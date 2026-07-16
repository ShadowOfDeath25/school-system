import PromotionDashboard from "@pages/PromoteStudents/PromotionDashboard.jsx";
import BatchHistory from "@pages/PromoteStudents/BatchHistory.jsx";
import BatchDetail from "@pages/PromoteStudents/BatchDetail.jsx";
import SupplementaryExamResolution from "@pages/PromoteStudents/SupplementaryExamResolution.jsx";
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
            element: <PromotionDashboard/>,
            handle: {
                sidebar: {
                    title: "الترقية",
                },
                action: "view promotion",
            },
        },
        {
            path: "batches",
            element: <BatchHistory/>,
            handle: {
                sidebar: {
                    title: "سجل الترقيات",

                },
                action: "view promotion",
            },
        },
        {
            path: "batches/:batchId",
            element: <BatchDetail/>,
            handle: {
                title: "تفاصيل الترقية",
                action: "view promotion",
            },
        },
        {
            path: "batches/:batchId/supplementary-exam/:studentId",
            element: <SupplementaryExamResolution/>,
            handle: {
                title: "نتيجة الدور الثاني",
                action: "update promotion",
            },
        },
        {
            path: "graduation/:batchId",
            element: <GraduationReport/>,
            handle: {
                title: "تقارير التخرج",

                action: "view promotion",
            },
        },
    ],
};

export default routes;
