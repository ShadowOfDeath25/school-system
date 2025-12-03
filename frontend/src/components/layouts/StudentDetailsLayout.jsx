import {useStudentDetailsPage} from "@hooks/useStudentDetails.js";
import {Navigate, Outlet, useMatches} from "react-router-dom";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import DetailsPage from "@ui/DetailsPage/DetailsPage.jsx";

export default function StudentDetailsLayout() {
    const {student, isLoading, academicYear, setAcademicYear} = useStudentDetailsPage();
    const matches = useMatches();
    console.log(matches.filter(match=>Boolean(match?.handle?.breadcrumbs)))

    const currentRoute = matches[matches.length - 2];
    const fallbackRedirect = currentRoute?.handle?.fallbackRedirect ?? "/";


    const breadcrumbsLinks = matches
        .filter(match => Boolean(match.handle?.breadcrumbs))
        .flatMap(match => match.handle.breadcrumbs());

    if (isLoading) {
        return (
            <div style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <LoadingScreen/>
            </div>
        );
    }
    if (!student) {
        return <Navigate to={fallbackRedirect}/>;
    }
    return (
        <DetailsPage
            student={student}
            academicYear={academicYear}
            setAcademicYear={setAcademicYear}
            breadcrumbsLinks={breadcrumbsLinks}
        >
            <Outlet context={{student,academicYear,setAcademicYear}}/>
        </DetailsPage>
    );
}
