import {useGetAll} from "@hooks/api/useCrud.js";
import ClassroomsReport from '@reports/ClassroomsReport.jsx'
import {Button} from "@mui/material";

import {useRef} from "react";

export default function Test() {
    const {data, isLoading} = useGetAll("students", {classroom: "null"});
    const ref = useRef(null)

    // const handlePrint = useReactToPrint({
    //     contentRef:ref
    // })
    return (
        <>
            <Button onClick={handlePrint}>Generate report</Button>

        </>
    );
}
