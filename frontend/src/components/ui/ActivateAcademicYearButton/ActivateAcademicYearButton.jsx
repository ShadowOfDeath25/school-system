import {Button} from "@mui/material";
import {Activity} from "react";
import {useQueryClient} from "@tanstack/react-query";
import axiosClient from "../../../axiosClient.js";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import {useCurrentUser} from "@hooks/api/auth.js";

export default function ActivateAcademicYearButton({row}) {
    const queryClient = useQueryClient();
    const {data: user} = useCurrentUser();
    const {showSnackbar} = useSnackbar();
    const userCanUpdate = user?.role.includes("Super Admin") || user?.permissions.includes("update academic-years");
    const onClick = async () => {
        const response = await axiosClient.patch(`academic-years/${row.id}/activate`);
        if (response.status === 204) {
            await queryClient.invalidateQueries({queryKey: ["academic-years"]})
            showSnackbar("تم تعيين العام الدراسي الحالي بنجاح")
        }else {
            showSnackbar("حدث خلل أثناء تعيين العام الدراسي", "error")
        }
    }
    return (
        <Activity mode={!userCanUpdate || row.active === "نعم" ? "hidden" : "visible"}>
            <Button variant={"contained"} color="primary" onClick={onClick}>
                تعيين كالعام الدراسي الحالي
            </Button>
        </Activity>
    );
}

