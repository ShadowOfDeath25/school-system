import React from 'react';
import App from '/src/App.jsx'
import Test from '@ui/Test.jsx';
import { userRoutes } from '@routes/userRoutes.jsx';

const mainRoutes = {
    handle: {
        sidebar: {
            header: 'test 1',
        },
    },
    children: [
        {
            index: true,
            element: <App />,
            handle: {
                sidebar: {
                    title: 'App',
                },
            },
        },
        {
            path: 'test',
            element: <Test />,
            handle: {
                sidebar: {
                    title: 'Test',
                },
            },
        },
    ],
};

export const appRoutes = [mainRoutes, userRoutes];
