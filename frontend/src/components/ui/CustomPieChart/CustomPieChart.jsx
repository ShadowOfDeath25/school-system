import { useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import styles from './styles.module.css';
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CustomPieChart({ data, loading = false }) {
    const chartRef = useRef(null);

    const getCssVariable = (variable) => {
        return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    };

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

    const labels = chartData.map(item => item.name);
    const values = chartData.map(item => item.value);

    const doughnutData = {
        labels: labels,
        datasets: [
            {
                data: values,
                backgroundColor: COLORS.slice(0, values.length),
                borderColor: getCssVariable('--primary-text-color'),
                borderWidth: 2,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        layout: {
            padding: 30
        },
        plugins: {
            legend: {
                position: 'bottom',
                rtl: true,
                labels: {
                    color: getCssVariable('--primary-text-color'),
                    font: {
                        size: 14
                    },
                    padding: 15,
                    usePointStyle: true,
                    pointStyle: 'rect',
                    generateLabels: (chart) => {
                        const data = chart.data;
                        if (data.labels.length && data.datasets.length) {
                            return data.labels.map((label, i) => {
                                const meta = chart.getDatasetMeta(0);
                                const style = meta.controller.getStyle(i);

                                return {
                                    text: label,
                                    fillStyle: style.backgroundColor,
                                    strokeStyle: 'transparent',
                                    lineWidth: 0,
                                    hidden: !chart.getDataVisibility(i),
                                    index: i,
                                    fontColor: getCssVariable('--primary-text-color'),
                                    pointStyle: 'rect'
                                };
                            });
                        }
                        return [];
                    }
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
                displayColors: true,
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value.toLocaleString()} (${percentage}%)`;
                    }
                }
            }
        }
    };

    useEffect(() => {
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, []);

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>التلاميذ</h3>
            <div style={{ minWidth: "400px", width: '100%', height: 400 }}>
                {loading && <LoadingScreen />}
                {!loading && (
                    <Doughnut ref={chartRef} data={doughnutData} options={options} />
                )}
            </div>
        </div>
    );
}
