import { useEffect, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import styles from './styles.module.css';
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function CustomBarChart({ data = [], loading = false }) {
    const chartRef = useRef(null);


    const getCssVariable = (variable) => {
        return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    };

    const formatYAxis = (value) => {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
        return value;
    };

    const chartData = {
        labels: data.map(item => item.month),
        datasets: [
            {
                label: 'ايرادات',
                data: data.map(item => item.incomes),
                backgroundColor: '#4caf50',
                borderColor: '#4caf50',
                borderWidth: 1
            },
            {
                label: 'مصروفات',
                data: data.map(item => item.expenses),
                backgroundColor: '#f44336',
                borderColor: '#f44336',
                borderWidth: 1
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: true,
        scales: {
            x: {
                ticks: {
                    color: getCssVariable('--primary-text-color'),
                    font: {
                        size: 16
                    }
                },
                grid: {
                    color: "rgba(0,0,0,0)"
                },
                border: {
                    color: getCssVariable('--primary-text-color')
                },
            },
            y: {
                ticks: {
                    color: getCssVariable('--primary-text-color'),
                    callback: function (value) {
                        return formatYAxis(value);
                    },
                    font: {
                        size: 16
                    }
                },
                grid: {
                    color: "rgba(255,255,255,0.1)"
                },
                border: {
                    color: getCssVariable('--primary-text-color')
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                rtl: true,
                labels: {
                    color: getCssVariable('--primary-text-color'),
                    font: {
                        size: 14
                    },
                    padding: 15,
                    usePointStyle: true,
                    pointStyle: 'rect'
                }
            },
            tooltip: {
                rtl: true,
                backgroundColor: getCssVariable('--primary-color'),
                borderColor: 'var(--secondary-color)',
                borderWidth: 1,
                titleColor: getCssVariable('--primary-text-color'),
                bodyColor: getCssVariable('--primary-text-color'),
                padding: 12,
                displayColors: true
            }
        }
    };

    useEffect(() => {
        return () => {
            if (chartRef.current) {
                // Cleanup handled by react-chartjs-2
            }
        };
    }, []);

    return (
        <div className={styles.container}>
            <div style={{ minWidth: "900px", width: '100%', height: 400 }}>
                {loading && <LoadingScreen />}
                {!loading && (
                    <Bar ref={chartRef} data={chartData} options={options} />
                )}
            </div>
        </div>
    );
}
