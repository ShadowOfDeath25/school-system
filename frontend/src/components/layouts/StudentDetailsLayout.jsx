import {useStudentDetails} from "@hooks/useStudentDetails.js";
import {Navigate, Outlet, useMatches} from "react-router-dom";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";
import DetailsPage from "@ui/DetailsPage/DetailsPage.jsx";
import {useCurrentUser} from "@hooks/api/auth.js";

export default function StudentDetailsLayout() {
    const {student, isLoading, academicYear, setAcademicYear} = useStudentDetails();
    const matches = useMatches();


    const currentRoute = matches[matches.length - 2];
    const fallbackRedirect = currentRoute?.handle?.fallbackRedirect ?? "/";
    const {data: currentUser} = useCurrentUser();


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
            <Outlet context={{student, academicYear, setAcademicYear, user: currentUser}}/>
        </DetailsPage>
    );
}
