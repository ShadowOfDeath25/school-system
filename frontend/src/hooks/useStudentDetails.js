import {useLocation, useParams} from "react-router-dom";
import {useGet} from "@hooks/api/useCrud.js";
import {useState} from "react";
import {getAcademicYears} from "@utils/getAcademicYears.js";

export function useStudentDetails() {
    const {state} = useLocation();
    const studentFromState = state?.student;

    const {id} = useParams();

    const {data: fetchedStudent, isLoading} = useGet('students', id, {}, {enabled: !studentFromState});

    const student = studentFromState || fetchedStudent;

    const [academicYear, setAcademicYear] = useState(getAcademicYears()[0]);

    return {student, isLoading, academicYear, setAcademicYear};
}
