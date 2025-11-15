import {useGetAll} from "@hooks/api/useCrud.js";
import {useState} from "react";
import {getAcademicYears} from "@utils/getAcademicYears.js";
import DetailsPage from "@ui/DetailsPage/DetailsPage.jsx";


export default function Test() {
    const {data, isLoading} = useGetAll("students");
    const [academicYear, setAcademicYear] = useState(getAcademicYears()[0]);

    return (
        <>

            {!isLoading &&
                <DetailsPage
                    student={data?.data[2]}
                />
            }

        </>

    );
}
