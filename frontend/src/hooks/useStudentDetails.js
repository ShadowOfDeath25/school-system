import { useLocation, useParams } from "react-router-dom";
import { useGet, useGetAll } from "@hooks/api/useCrud.js";
import { useEffect} from "react";
import { usePersistedState } from "@hooks/usePersistedState.js";

export function useStudentDetails() {
    const { state } = useLocation();
    const studentFromState = state?.student;

    const { id } = useParams();

    const { data: fetchedStudent, isLoading } = useGet('students', id, {}, { enabled: !studentFromState });

    const student = studentFromState || fetchedStudent;

    const { data: academicYears = [] } = useGetAll('academic-years');
    const [academicYear, setAcademicYear] = usePersistedState('academicYear', "");

    useEffect(() => {
        if (!academicYear && academicYears.length > 0) {
            setAcademicYear(academicYears[0]);
        }
    }, [academicYear, academicYears, setAcademicYear]);

    return { student, isLoading, academicYear, setAcademicYear };
}
