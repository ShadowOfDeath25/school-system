import React from 'react';
import App from '/src/App.jsx'
import Test from '@ui/Test.jsx';
import usersRoutes from '@routes/users.jsx';
import rolesRoutes from "@routes/roles.jsx";
import studentsRoutes from "@routes/students.jsx";
import classroomsRoutes from "@routes/classrooms.jsx"
import buildingAndFloorsRoutes from '@routes/buildingsAndFloors.jsx'
import subjectsRoutes from '@routes/subjects.jsx'
import examsRoutes from '@routes/exams.jsx'
import seatNumbersRoutes from '@routes/seatNumbers.jsx'
import secretNumbersRoutes from '@routes/secretNumbers.jsx'
import expensesRoutes from '@routes/expenses.jsx'
import booksRoutes from '@routes/books.jsx'
import uniformsRoutes from '@routes/uniforms.jsx'
import incomesRoutes from '@routes/incomes.jsx'
import bankAccountsRoutes from '@routes/bankAccounts.jsx'
import busesRoutes from "@routes/buses.jsx";

const mainRoutes = {
    handle: {
        sidebar: {
            header: 'test 1',
        },
    },
    children: [
        {
            index: true,
            element: <App/>,
            handle: {
                sidebar: {
                    title: 'App',
                },
            },
        },
        {
            path: 'test',
            element: <Test/>,
            handle: {
                sidebar: {
                    title: 'Test',
                },
            },
        },
    ],
};

export const appRoutes = [
    mainRoutes,
    usersRoutes,
    rolesRoutes,
    studentsRoutes,
    classroomsRoutes,
    buildingAndFloorsRoutes,
    subjectsRoutes,
    examsRoutes,
    seatNumbersRoutes,
    secretNumbersRoutes,
    expensesRoutes,
    booksRoutes,
    uniformsRoutes,
    incomesRoutes,
    bankAccountsRoutes,
    busesRoutes
];
