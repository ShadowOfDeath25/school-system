import MarksIndex from "@pages/Marks/ClassroomPicker.jsx";
import RecordMarks from "@pages/Marks/RecordMarks/RecordMarks.jsx";
import SecondRoundStudents from "@pages/Marks/SecondRoundStudents.jsx";
import MarksReports from "@pages/Marks/MarksReports/MarksReports.jsx";
import PromotionDashboard from "@pages/PromoteStudents/PromotionDashboard.jsx";
import BatchHistory from "@pages/PromoteStudents/BatchHistory.jsx";
import BatchDetail from "@pages/PromoteStudents/BatchDetail.jsx";
import SupplementaryExamResolution from "@pages/PromoteStudents/SupplementaryExamResolution.jsx";
import GraduationReport from "@pages/PromoteStudents/GraduationReport.jsx";

const routes = {
    path: "marks",
    handle: {
        sidebar: {
            header: "الدرجات",
            name: "marks",
        },
    },
    children: [
        {
            index: true,
            element: <MarksIndex />,
            handle: {
                sidebar: { title: "تسجيل الدرجات" },
                action: "view marks",
            },
        },
        {
            path: "second-round",
            element: <SecondRoundStudents />,
            handle: {
                sidebar: { title: "دور ثاني" },
                action: "view marks",
            },
        },
        {
            path: "record/:studentId",
            element: <RecordMarks />,
            handle: {
                title: "تسجيل الدرجات",
                action: "update marks",
            },
        },
        {
            path: "marks-report",
            element: <MarksReports />,
            handle: {
                sidebar: { title: "تقارير الدرجات" },
                action: "view student-reports",
            },
        },
        {
            path:'promotion',
            element: <PromotionDashboard/>,
            handle: {
                sidebar: {
                    title: "الترقية",
                },
                action: "view promotion",
            },
        },
        {
            path: "promotions/batches",
            element: <BatchHistory/>,
            handle: {
                sidebar: {
                    title: "سجل الترقيات",

                },
                action: "view promotion",
            },
        },
        {
            path: "promotions/batches/:batchId",
            element: <BatchDetail/>,
            handle: {
                title: "تفاصيل الترقية",
                action: "view promotion",
            },
        },
        {
            path: "promotions/batches/:batchId/supplementary-exam/:studentId",
            element: <SupplementaryExamResolution/>,
            handle: {
                title: "نتيجة الدور الثاني",
                action: "update promotion",
            },
        },
        {
            path: "promotions/graduation/:batchId",
            element: <GraduationReport/>,
            handle: {
                title: "تقارير التخرج",

                action: "view promotion",
            },
        },
    ],
};

export default routes;
