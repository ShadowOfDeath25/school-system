const sidebarItems = [
    {
        panel: 'panel1',
        header: 'test 1',
        links: [
            {
                title: "Test",
                to: "/test"
            },
            {
                title: "App",
                to: "/"
            }
        ]
    },
    {
        panel: 'panel2',
        header: 'المستخدمين',
        links: [
            {
                title: "اضافة مستخدم",
                to: "/users/add",
                action: "create users"
            },
            {
                title: "عرض المستخدمين",
                to: "/users",
                action: "view users"
            }
        ],
        name:"users"
    },

];
export default sidebarItems;
