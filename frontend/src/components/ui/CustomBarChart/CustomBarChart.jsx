import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import styles from './styles.module.css';
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";

export default function CustomBarChart({data, loading = false}) {
    const formatYAxis = (value) => {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
        return value;
    };

    return (<div className={styles.container}>
        <div style={{minWidth: "900px", width: '100%', height: 400}}>
            {loading && <LoadingScreen/>}
            {!loading && <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{top: 10, right: 10, left: 0, bottom: 20}}
                >
                    <XAxis
                        dataKey="month"
                        stroke="white"
                        tick={{fill: 'var(--primary-text-color)'}}
                        direction={"rtl"}
                    />
                    <YAxis
                        stroke="white"
                        tick={{fill: 'var(--primary-text-color)'}}
                        tickFormatter={formatYAxis}
                        direction={"ltr"}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--primary-color)',
                            borderColor: 'var(--secondary-color)',
                            color: 'white'
                        }}
                        itemStyle={{color: 'var(--primary-text-color)'}}
                        cursor={{fill: 'rgba(0,0,0,0.2)'}}
                    />
                    <Legend
                        iconType="square"
                        wrapperStyle={{
                            color: 'var(--primary-text-color)', top: 10, left: 0, right: 0, width: "100%"
                        }}
                        align='center'
                        verticalAlign='top'
                        formatter={(value) => <span
                            style={{marginRight: '10px', marginLeft: '10px'}}>{value}</span>}
                    />
                    <Bar
                        dataKey="incomes"
                        name="ايرادات"
                        fill="#4caf50"
                    />
                    <Bar
                        dataKey="expenses"
                        name="مصروفات"
                        fill="#f44336"
                    />
                </BarChart>
            </ResponsiveContainer>
            }
        </div>
    </div>);
}
