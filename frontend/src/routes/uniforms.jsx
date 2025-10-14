import AddUniforms from "@pages/Uniform/AddUniforms.jsx";
import BuyUniforms from "@pages/Uniform/BuyUniforms.jsx";
import ViewUniforms from "@pages/Uniform/ViewUniforms.jsx";
import ViewUniformPurchases from "@pages/Uniform/ViewUniformPurchases.jsx";

const routes = {
    path: 'uniforms',
    handle: {
        sidebar: {
            header: 'مخزن الزي',
            name: 'uniforms'
        }
    },
    children: [
        {
            index: true,
            element: <ViewUniforms/>,
            handle: {
                sidebar: {
                    title: "واردات الزي",
                    action: "view uniforms"
                }
            }
        },
        {
            path: "buy",
            element: <BuyUniforms/>,
            handle: {
                sidebar: {
                    title: "صرف الزي",
                    action: 'create uniform-purchases'
                },
            }
        },
        {
            path: 'add',
            element: <AddUniforms/>,
            handle: {
                sidebar: {
                    title: 'اضافة زي',
                    action: 'create uniforms'
                }
            }
        },
        {
            path: 'purchases',
            element: <ViewUniformPurchases/>,
            handle: {
                sidebar: {
                    title: "منصرف الزي",
                    action: 'view uniform-purchases'
                }
            }
        }

    ]
}
export default routes
