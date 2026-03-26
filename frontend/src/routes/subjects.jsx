import AddSubjects from "@pages/Subjects/AddSubjects.jsx";
import ViewSubjects from "@pages/Subjects/ViewSubjects.jsx";
import SubjectTypes from "@pages/Subjects/SubjectTypes.jsx";
import styles from "@ui/Page/style.module.css";
import GradePicker from "@pages/AssignSubjectsToGrades/GradePicker.jsx";
import AssignSubjectToGrades from "@pages/AssignSubjectsToGrades/AssignSubjectToGrades.jsx";
import {Link} from "react-router-dom";


const routes = {
    path: 'subjects',
    handle: {
        sidebar: {
            header: 'المواد الدراسية',
            name: 'subjects'
        }
    },
    children: [
        {
            index: true,
            element: <ViewSubjects/>,
            handle: {
                sidebar: {
                    title: "المواد الدراسية",
                },
                action: "view subjects"
            }
        },
        {
            path: 'add',
            element: <AddSubjects/>,
            handle: {
                sidebar: {
                    title: "اضافة مادة",
                },
                action: "create subject"
            }
        },
        {
            path: 'types',
            element: <SubjectTypes/>,
            handle: {
                sidebar: {
                    title: "انواع المواد",
                },
                action: "view subjects"
            }
        },
        {
            path: "assign-to-grade",
            element: <GradePicker/>,
            handle: {
                sidebar: {
                    title: "تعيين للسنوات الدراسية"
                },
                action: "create grade-subjects"
            }
        },
        {
            path: "assign-to-grade/:grade",
            element: <AssignSubjectToGrades/>,
            handle: {
                title: "تعيين المواد لسنة دراسية",
                breadcrumbs: () => [
                    <Link className={styles.breadcrumbLink} to={'/subjects'}>المواد الدراسية</Link>,
                    <Link className={styles.breadcrumbLink} to={'/subjects/assign-to-grade'}>تعيين للسنوات
                        الدراسية</Link>
                ]
            }
        }
    ]
}
export default routes;
