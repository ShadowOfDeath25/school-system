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

/**
 * An array of route objects that are used to build the main application's
 * navigation and routing structure. These routes are rendered within the
 * DefaultLayout and are used to dynamically generate the sidebar.
 */
export const appRoutes = [mainRoutes, userRoutes];
