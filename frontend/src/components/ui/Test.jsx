import {useGetAll} from "@hooks/api/useCrud.js";
import StudentData from "@ui/StudentData/StudentData.jsx";
import Page from "@ui/Page/Page.jsx";

export default function Test() {
    const {data, isLoading} = useGetAll("students");

    return (
        <>

            {!isLoading && <Page>
                <StudentData
                    student={data?.data[0]}
                />
            </Page>}

        </>

    );
}
