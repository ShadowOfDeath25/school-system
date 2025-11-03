import {useGetAll} from "@hooks/api/useCrud.js";
import StudentData from "@ui/StudentData/StudentData.jsx";
import Page from "@ui/Page/Page.jsx";
import StudentPayments from "@ui/StudentPayements/StudentPayments.jsx";
import {useState} from "react";
import {getAcademicYears} from "@utils/getAcademicYears.js";

export default function Test() {
    const {data, isLoading} = useGetAll("students");
    const [academicYear, setAcademicYear] = useState(getAcademicYears()[0]);
    console.log(academicYear);
    return (
        <>

            {!isLoading && <Page>
                <div style={{
                    display: "flex",
                    gap: "3%"
                }}>
                    <StudentData
                        student={data?.data[1]}
                        academicYear={academicYear}
                        setAcademicYear={setAcademicYear}
                    />
                    <StudentPayments
                        student={data?.data[1]}
                        acdaemicYear={academicYear}
                    />
                </div>
            </Page>}

        </>

    );
}
