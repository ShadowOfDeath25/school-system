import AddBooks from "@pages/Books/AddBooks.jsx";
import ViewBooks from "@pages/Books/ViewBooks.jsx";
import BuyBooks from "@pages/Books/BuyBooks.jsx";

const routes = {
    path: 'books',
    handle: {
        sidebar: {
            header: 'مخزن الكتب',
            name: 'books'
        }
    },
    children: [
        {
            index: true,
            element: <ViewBooks/>,
            handle: {
                sidebar: {
                    title: "واردات الكتب",
                    action: "view books"
                }
            }
        },
        {
            path: "buy",
            element: <BuyBooks/>,
            handle: {
                sidebar: {
                    title: "صرف الكتب",
                    action: 'create book-purchases'
                },
            }
        },
        {
            path: 'add',
            element: <AddBooks/>,
            handle: {
                sidebar: {
                    title: 'اضافة نسخة',
                    action: 'create books'
                }
            }
        }

    ]
}
export default routes
