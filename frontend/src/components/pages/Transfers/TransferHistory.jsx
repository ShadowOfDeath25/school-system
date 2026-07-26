import { useState, useEffect } from "react";
import Page from "@ui/Page/Page.jsx";
import SelectField from "@ui/SelectField/SelectField.jsx";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import { useSnackbar } from "@contexts/SnackbarContext.jsx";
import styles from "./styles.module.css";
import axiosClient from "../../../axiosClient.js";

const DIRECTION_LABELS = {
    incoming: "تحويل الي المدرسة",
    outgoing: "تحويل من المدرسة",
};

const DIRECTION_PILLS = {
    incoming: styles.pillIncoming,
    outgoing: styles.pillOutgoing,
};

export default function TransferHistory() {
    const { showSnackbar } = useSnackbar();
    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState(null);
    const [academicYear, setAcademicYear] = useState("");
    const [direction, setDirection] = useState("");
    const [search, setSearch] = useState("");
    const [academicYears, setAcademicYears] = useState([]);
    const [directionOptions, setDirectionOptions] = useState([]);

    useEffect(() => {
        axiosClient.get("/transfers/filters")
            .then((res) => {
                setAcademicYears((res.data.academic_years || []).map(y => ({
                    value: y, label: y,
                })));
                setDirectionOptions((res.data.directions || []).map(d => ({
                    value: d.value, label: d.label,
                })));
            })
            .catch(() => {});
    }, []);

    const fetchHistory = (page = 1) => {
        setLoading(true);
        const params = { page, per_page: 30 };
        if (academicYear) params.academic_year = academicYear;
        if (direction) params.direction = direction;
        if (search) params.search = search;

        axiosClient.get("/transfers/history", { params })
            .then((res) => {
                setTransfers(res.data.data || []);
                setMeta(res.data.meta || null);
            })
            .catch(() => showSnackbar("حدث خطأ أثناء تحميل السجل", "error"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchHistory();
    }, [academicYear, direction]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchHistory();
    };

    const dirOptions = [
        { value: "", label: "الكل" },
        ...directionOptions,
    ];
    const yearOptions = [
        { value: "", label: "الكل" },
        ...academicYears,
    ];

    return (
        <Page>
            <div className={styles.container}>
                <h4 className={styles.sectionTitle}>سجل التحويلات</h4>

                <div className={styles.filters}>
                    <div className={styles.filterItem}>
                        <SelectField
                            name="direction"
                            label="اتجاه التحويل"
                            placeholder="الكل"
                            value={direction}
                            options={dirOptions}
                            handleChange={(e) => setDirection(e.target.value)}
                        />
                    </div>
                    <div className={styles.filterItem}>
                        <SelectField
                            name="academic_year"
                            label="العام الدراسي"
                            placeholder="الكل"
                            value={academicYear}
                            options={yearOptions}
                            handleChange={(e) => setAcademicYear(e.target.value)}
                        />
                    </div>
                </div>

                <form onSubmit={handleSearch} className={styles.searchForm}>
                    <input
                        className={styles.searchInput}
                        type="text"
                        placeholder="بحث باسم الطالب أو رقم القيد..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className={styles.buttonInline}>بحث</button>
                </form>

                {loading ? (
                    <LoadingScreen />
                ) : transfers.length === 0 ? (
                    <div className={styles.emptyState}>
                        <h3>لا توجد تحويلات</h3>
                    </div>
                ) : (
                    <div className={styles.tableSection}>
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>التلميذ</th>
                                    <th>رقم القيد</th>
                                    <th>النوع</th>
                                    <th>اسم المدرسة</th>
                                    <th>العام الدراسي</th>
                                    <th>ملاحظات</th>
                                    <th>تاريخ التحويل</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transfers.map((t, idx) => (
                                    <tr key={t.id}>
                                        <td>{meta ? (meta.current_page - 1) * meta.per_page + idx + 1 : idx + 1}</td>
                                        <td>{t.student_name}</td>
                                        <td>{t.student_reg_number}</td>
                                        <td>
                                            <span className={`${styles.pill} ${DIRECTION_PILLS[t.direction] || ""}`}>
                                                {DIRECTION_LABELS[t.direction] || t.direction}
                                            </span>
                                        </td>
                                        <td>{t.other_school_name}</td>
                                        <td>{t.academic_year}</td>
                                        <td>{t.notes || "—"}</td>
                                        <td>{t.transfer_date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {meta && (
                            <div className={styles.pagination}>
                                <span>صفحة {meta.current_page} من {meta.last_page}</span>
                                <div className={styles.paginationButtons}>
                                    <button
                                        className={styles.buttonInline}
                                        disabled={!meta.prev_page_url}
                                        onClick={() => fetchHistory(meta.current_page - 1)}
                                    >
                                        السابق
                                    </button>
                                    <button
                                        className={styles.buttonInline}
                                        disabled={!meta.next_page_url}
                                        onClick={() => fetchHistory(meta.current_page + 1)}
                                    >
                                        التالي
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Page>
    );
}
