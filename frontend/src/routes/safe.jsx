import NetIncome from "@pages/NetIncome/NetIncome.jsx";

const route = {
    path: "safe",
    handle: {
        sidebar: {
            header: "الخزنة",
            name: "safe"
        }
    },
    children: [
        {
            path: "net-income",
            handle: {
                sidebar: {
                    title: "صافي الدخل"
                },
                action: "view net-income"
            },
            element: <NetIncome/>
        }
    ]
}
export default route
