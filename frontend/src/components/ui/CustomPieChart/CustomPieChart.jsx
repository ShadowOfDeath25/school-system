import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import styles from './styles.module.css';
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";

export default function CustomPieChart({ data, loading = false }) {
    const COLORS = [
        '#4caf50',
        '#f44336',
        '#2196f3',
        '#ff9800',
        '#9c27b0',
        '#00bcd4',
        '#ffeb3b',
        '#795548'
    ];

    const chartData = Array.isArray(data)
        ? data
        : data
            ? Object.entries(data).map(([name, value]) => ({ name, value }))
            : [];

    const formatValue = (value) => {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
        return value;
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            return (
                <div style={{
                    backgroundColor: 'var(--primary-color)',
                    border: '1px solid var(--secondary-color)',
                    padding: '10px',
                    color: 'var(--primary-text-color)',
                    direction: 'rtl'
                }}>
                    <p style={{ margin: 0 }}>{`${data.name}: ${data.value.toLocaleString()}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>التلاميذ</h3>
            <div style={{ minWidth: "400px", width: '100%', height: 400 }}>
                {loading && <LoadingScreen />}
                {!loading && (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                innerRadius={60}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => {
                                    const percentage = (percent * 100).toFixed(0);
                                    return percentage >= 5 ? `${name} ${percentage}%` : '';
                                }}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                iconType="circle"
                                wrapperStyle={{
                                    color: 'var(--primary-text-color)',
                                    direction: 'rtl'
                                }}
                                formatter={(value) => <span style={{ marginRight: '10px', marginLeft: '10px' }}>{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
