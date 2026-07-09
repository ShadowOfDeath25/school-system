import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Page from "@ui/Page/Page.jsx";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import { useSnackbar } from "@contexts/SnackbarContext.jsx";
import styles from "./styles.module.css";
import axiosClient from "../../../axiosClient.js";

export default function GraduationReport() {
    const { batchId } = useParams();
    const { showSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [graduates, setGraduates] = useState([]);
    const [batch, setBatch] = useState(null);

    useEffect(() => {
        axiosClient
            .get(`/promotion/batches/${batchId}`)
            .then((res) => {
                const data = res.data.data;
                setBatch(data);
                const graduatedStudents = (data.batch_students || []).filter(
                    (bs) => bs.decision === "graduated"
                );
                setGraduates(graduatedStudents);
                setLoading(false);
            })
            .catch(() => {
                showSnackbar("حدث خطأ أثناء تحميل البيانات", "error");
                setLoading(false);
            });
    }, [batchId]);

    if (loading) {
        return (
            <Page>
                <LoadingScreen />
            </Page>
        );
    }

    return (
        <Page
            breadcrumbsLinks={[
                <Link to="/promotion">الترقية</Link>,
                <Link to="/promotion/batches">سجل الترقيات</Link>,
            ]}
        >
            <div className={styles.container}>
                <h4 className={styles.sectionTitle}>تقرير التخرج</h4>
                {batch && (
                    <p style={{ color: "var(--ternary-text-color)", margin: "0 0 16px" }}>
                        دفعة: {batch.from_academic_year} → {batch.to_academic_year}
                    </p>
                )}

                {graduates.length === 0 && (
                    <div className={styles.emptyState}>
                        لا يوجد طلاب متخرجون في هذه الدفعة
                    </div>
                )}

                {graduates.length > 0 && (
                    <div className={styles.tableSection}>
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>الاسم</th>
                                    <th>الصف</th>
                                    <th>الحالة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {graduates.map((g, idx) => (
                                    <tr key={g.id}>
                                        <td>{idx + 1}</td>
                                        <td>{g.student_name}</td>
                                        <td>{g.from_grade}</td>
                                        <td>
                                            <span className={`${styles.pill} ${styles.pillGraduated}`}>
                                                متخرج
                                            </span>
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
