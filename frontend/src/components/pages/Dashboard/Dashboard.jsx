import {useGetAll} from "@hooks/api/useCrud.js";
import Page from "@ui/Page/Page.jsx";
import CustomBarChart from "@ui/CustomBarChart/CustomBarChart.jsx";
import CustomPieChart from "@ui/CustomPieChart/CustomPieChart.jsx";
import styles from './styles.module.css';
import StatCard from "@ui/StatCard/StatCard.jsx";
import GroupsIcon from "@mui/icons-material/Groups";
import AppsIcon from '@mui/icons-material/Apps';
import PaymentsIcon from '@mui/icons-material/Payments';
export default function Dashboard() {
    const {data: dashboardData, isLoading} = useGetAll('dashboard');
    const chartData = dashboardData?.financial?.monthly || [];
    const studentData = dashboardData?.students?.students_by_status || [];
    const {total_classrooms: totalClassrooms, total_students: totalStudents} = dashboardData?.students || {};
    const {expenses: totalExpenses, incomes: totalIncome} = dashboardData?.financial?.total || {};
    return (
        <Page>
            <div className={styles.statCards}>
                <StatCard
                    stat={totalClassrooms}
                    label={"عدد الفصول"}
                    icon={<AppsIcon/>}
                    backgroundColor={"#0c079d"}
                />
                <StatCard
                    stat={totalStudents}
                    label={"عدد التلاميذ"}
                    icon={<GroupsIcon/>}
                    backgroundColor={"#9d5c07"}
                />
                <StatCard
                    stat={totalExpenses}
                    label={"إجمالي المصروفات"}
                    icon={<PaymentsIcon/>}
                    backgroundColor={"#9d0707"}
                />
                <StatCard
                    stat={totalIncome}
                    label={"إجمالي الإيرادات"}
                    icon={<PaymentsIcon/>}
                    backgroundColor={"#3e9d07"}
                />

            </div>
            <div className={styles.chartsWrapper}>
                <CustomPieChart
                    data={studentData}
                    loading={isLoading}
                />
                <CustomBarChart
                    data={chartData}
                    loading={isLoading}
                />
            </div>


        </Page>
    );
}



