import {useGetAll} from "@hooks/api/useCrud.js";
import StudentData from "@ui/StudentData/StudentData.jsx";
import Page from "@ui/Page/Page.jsx";
import StudentPayments from "@ui/StudentPayements/StudentPayments.jsx";

export default function Test() {
    const {data, isLoading} = useGetAll("students");

    return (
        <>

            {!isLoading && <Page>
                <div style={{
                    display: "flex",
                    gap: "3%"
                }}>
                    <StudentData
                        student={data?.data[0]}
                    />
                    <StudentPayments
                        student={data?.data[0]}
                    />
                </div>
            </Page>}

        </>

    );
}
