import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Page from "@ui/Page/Page.jsx";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import { useSnackbar } from "@contexts/SnackbarContext.jsx";
import styles from "./styles.module.css";
import axiosClient from "../../../axiosClient.js";

const STATUS_LABELS = {
    pending: "معلق",
    completed: "مكتمل",
    rolled_back: "ملغي",
};

const STATUS_PILLS = {
    pending: styles.pillPending,
    completed: styles.pillCompleted,
    rolled_back: styles.pillRolledBack,
};

export default function BatchHistory() {
    const { showSnackbar } = useSnackbar();
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = () => {
        setLoading(true);
        axiosClient
            .get("/promotion/batches", { params: { per_page: 50 } })
            .then((res) => setBatches(res.data.data || []))
            .catch(() => showSnackbar("حدث خطأ أثناء تحميل البيانات", "error"))
            .finally(() => setLoading(false));
    };

    const handleRollback = async (batchId) => {
        try {
            await axiosClient.post(`/promotion/batches/${batchId}/rollback`);
            showSnackbar("تم التراجع عن الترقية بنجاح");
            fetchBatches();
        } catch (err) {
            const msg = err.response?.data?.message || "حدث خطأ أثناء التراجع";
            showSnackbar(msg, "error");
        }
    };

    if (loading) {
        return (
            <Page>
                <LoadingScreen />
            </Page>
        );
    }

    return (
        <Page>
            <div className={styles.container}>
                <h4 className={styles.sectionTitle}>سجل الترقيات</h4>

                {batches.length === 0 && (
                    <div className={styles.emptyState}>
                        لا توجد ترقيات سابقة
                    </div>
                )}

                {batches.length > 0 && (
                    <div className={styles.tableSection}>
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>من عام</th>
                                    <th>إلى عام</th>
                                    <th>الإجمالي</th>
                                    <th>ناجح</th>
                                    <th>إعادة</th>
                                    <th>متخرج</th>
                                    <th>الحالة</th>
                                    <th>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {batches.map((batch, idx) => (
                                    <tr key={batch.id}>
                                        <td>{idx + 1}</td>
                                        <td>{batch.from_academic_year}</td>
                                        <td>{batch.to_academic_year}</td>
                                        <td>{batch.total_students}</td>
                                        <td>{batch.promoted_count}</td>
                                        <td>{batch.repeated_count}</td>
                                        <td>{batch.graduated_count}</td>
                                        <td>
                                            <span className={`${styles.pill} ${STATUS_PILLS[batch.status] || ""}`}>
                                                {STATUS_LABELS[batch.status] || batch.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.actions}>
                                                <Link
                                                    to={`/promotion/batches/${batch.id}`}
                                                    className={styles.buttonInline}
                                                >
                                                    عرض
                                                </Link>
                                                <Link
                                                    to={`/promotion/graduation/${batch.id}`}
                                                    className={styles.buttonInline}
                                                >
                                                    المتخرجون
                                                </Link>
                                                {batch.status === "completed" && (
                                                    <button
                                                        className={`${styles.buttonInline} ${styles.buttonDanger}`}
                                                        onClick={() => {
                                                            if (window.confirm("هل أنت متأكد من التراجع عن هذه الترقية؟")) {
                                                                handleRollback(batch.id);
                                                            }
                                                        }}
                                                    >
                                                        تراجع
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Page>
    );
}
