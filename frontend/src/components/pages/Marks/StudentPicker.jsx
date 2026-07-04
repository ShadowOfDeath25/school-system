import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import {Link, useLocation, useParams} from "react-router-dom";
import {useNavigate} from "react-router";
import styles from "@ui/Page/style.module.css";

export default function StudentPicker() {
    const {id: classroomId} = useParams();
    const {state} = useLocation();
    const navigate = useNavigate();

    const handleRowClick = (row) => {
        navigate(`/marks/record/${row.id}`, {
            state: { student: row, classroom: state?.classroom }
        });
    };

    const breadcrumbsLinks = [
        <Link to={"/marks"} className={styles.breadcrumbLink}>الفصول الدراسية</Link>
    ];

    return (
        <Page breadcrumbsLinks={breadcrumbsLinks}>
            <Table
                resource={"students"}
                params={{
                    classroom: state?.classroom?.name,
                    language: state?.classroom?.language,
                    "classroom.academic_year": state?.classroom?.academic_year,
                }}
                fields={[
                    {name: 'reg_number', label: "رقم القيد"},
                    {name: 'name_in_arabic', label: "الاسم"},
                    {name: "nid", label: "الرقم القومي"},
                    {name: 'religion', label: "الديانة"},
                ]}
                editable={false}
                deletable={false}
                onClick={handleRowClick}
            />
        </Page>
    );
}
