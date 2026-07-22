import AddBooks from "@pages/Books/AddBooks.jsx";
import ViewBooks from "@pages/Books/ViewBooks.jsx";
import BuyBooks from "@pages/Books/BuyBooks.jsx";
import ViewBookPurchases from "@pages/Books/ViewBookPurchases.jsx";

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
                },
                action: "view books"
            }
        },
        {
            path: 'add',
            element: <AddBooks/>,
            handle: {
                sidebar: {
                    title: 'اضافة نسخة',
                },
                action: 'create books'
            }
        },
        {
            path: 'purchases',
            element: <ViewBookPurchases/>,
            handle: {
                sidebar: {
                    title: "منصرف الكتب",
                },
                action: 'view book-purchases'
            }
        }

    ]
}
export default routes
