import styles from './styles.module.css';
import {useGetAll} from "@hooks/api/useCrud.js";
import LoadingScreen from "../LoadingScreen/LoadingScreen.jsx";


export default function IncomeSummary({startDate, endDate}) {
    const {data, isLoading, isError} = useGetAll('payments/summary', {start_date: startDate, end_date: endDate}, {
        enabled: !!startDate && !!endDate
    });

    if (isLoading) return <LoadingScreen/>;
    if (isError) return <div className={styles.error}>Error loading summary data</div>;
    if (!data) return null;

    const {incomes, expenses} = data;

    const formatValue = (val) => val;

    const totalIncomes = Object.values(incomes || {}).reduce((acc, val) => acc + parseFloat(val || 0), 0);
    const totalExpenses = Object.values(expenses || {}).reduce((acc, val) => acc + parseFloat(val || 0), 0);
    const netIncome = totalIncomes - totalExpenses;

    const expenseLabels = {
        books: "واردات الكتب",
        uniforms: "واردات الزي",
        expenses: "مصروفات متنوعة"
    };

    return (
        <div className={styles.container}>

            <div className={styles.section}>
                <h3 className={styles.title}>الإيرادات</h3>
                <div className={styles.grid}>
                    {Object.entries(incomes || {}).map(([key, value]) => (
                        <div key={key} className={styles.item}>
                            <span className={styles.label}>{key}</span>
                            <span className={styles.value}>{formatValue(value)}</span>
                        </div>
                    ))}
                    <div className={styles.item} style={{borderTop: '1px solid gray'}}>
                        <span className={styles.label}>الاجمالي</span>
                        <span className={styles.value}>{formatValue(totalIncomes.toFixed(2))}</span>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h3 className={styles.title}>المصروفات </h3>
                <div className={styles.grid}>
                    {Object.entries(expenses || {}).map(([key, value]) => (
                        <div key={key} className={styles.item}>
                            <span className={styles.label}>{expenseLabels[key] || key}</span>
                            <span className={styles.value}>{formatValue(value)}</span>
                        </div>
                    ))}
                    <div className={styles.item} style={{borderTop: '1px solid gray'}}>
                        <span className={styles.label}>الاجمالي</span>
                        <span className={styles.value}>{formatValue(totalExpenses.toFixed(2))}</span>
                    </div>
                </div>
            </div>
            <div className={styles.section}>
                <h3 className={styles.title}>صافي الربح</h3>
                <div className={styles.grid}>
                    <div className={styles.item}
                         style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'var(--secondary-color)'}}>
                        <span className={styles.label}>الصافي</span>
                        <span className={styles.value}
                              style={{fontSize: '1.5rem'}}>{formatValue(netIncome.toFixed(2))}</span>
                    </div>
                </div>
            </div>

        </div>
    );
}
