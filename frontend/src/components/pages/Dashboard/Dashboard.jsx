
import {useGetAll} from "@hooks/api/useCrud.js";
import Page from "@ui/Page/Page.jsx";
import CustomBarChart from "@ui/CustomBarChart/CustomBarChart.jsx";

export default function Dashboard() {
    const {data: dashboardData, isLoading} = useGetAll('dashboard');
    const chartData = dashboardData?.financial?.monthly || [];

    return (
        <Page>
            <div style={{width: '100%', display: "flex", justifyContent: "space-between"}}>
                <div style={{width: '30%', height: 400, backgroundColor: 'var(--primary-color)'}}></div>
                <CustomBarChart
                    data={chartData}
                    loading={isLoading}
                />
            </div>


        </Page>
    );
}



