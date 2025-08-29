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
                to: "/users/add"
            }
        ],
        allowedRoles: ['admin']
    },

];
export default sidebarItems;
