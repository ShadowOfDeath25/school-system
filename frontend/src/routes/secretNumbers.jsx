import ViewSecretNumber from "@pages/SecretNumber/ViewSecretNumber.jsx";
import AddSecretNumber from "@pages/SecretNumber/AddSecretNumber.jsx";

const routes = {
    path: 'secret-numbers',
    handle: {
        sidebar: {
            name: "secret-numbers",
            header: "الرقم السري"
        }
    },
    children: [
        {
            index: true,
            element: <ViewSecretNumber/>,
            handle: {
                sidebar: {
                    title: "الرقم السري",
                    action: "view secret-numbers"
                }
            }
        },
        {
            path: 'add',
            element: <AddSecretNumber/>,
            handle: {
                sidebar: {
                    title: "اضافة رقم سري",
                    action: "add secret-numbers"
                }
            }
        }
    ]

}
export default routes
