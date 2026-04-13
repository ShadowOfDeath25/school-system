import Page from "@ui/Page/Page.jsx";
import Table from "@ui/Table/Table.jsx";
import {Link, useLocation} from "react-router-dom";
import {useNavigate} from "react-router";
import styles from "@ui/Page/style.module.css";

export default function StudentPicker() {
    const {state} = useLocation();
    const navigate = useNavigate()

    const handleRowClick = (row) => {
        navigate(`/students/${row.id}/marks`, {state: {student: row, classroom: state.classroom}})
    }
    const breadcrumbsLinks = [
        <Link to={"/students/promote/classrooms"} className={styles.breadcrumbLink}>رصد الدرجات و ترقية الطلاب</Link>
    ]

    return (
        <Page breadcrumbsLinks={breadcrumbsLinks}>
            <Table
                resource={"students"}
                params={{
                    classroom: state.classroom.name,
                    language: state.classroom.language,
                    "classroom.academic_year": state.classroom.academic_year,
                }}
                fields={[
                    {name: 'reg_number', label: "رقم القيد"},
                    {name: 'name_in_arabic', label: "الاسم"},
                    {name: "nid", label: "الرقم القومي"},
                    {name: 'religion', label: "الديانة"}
                ]}
                editable={false}
                deletable={false}
                onClick={handleRowClick}
            />
        </Page>
    );
}

