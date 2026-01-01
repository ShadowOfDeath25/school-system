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
import paymentsRoutes from "@routes/payments.jsx";
import dashboardRoutes from "@routes/dashboard.jsx"


export const appRoutes = [
    dashboardRoutes,
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
    busesRoutes,
    paymentsRoutes,
];
