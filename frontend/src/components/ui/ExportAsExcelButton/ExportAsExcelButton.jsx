import {Button} from "@mui/material";
import axiosClient from "../../../axiosClient.js";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";

export default function ExportAsExcelButton({url, params, method = "get"}) {

    const {showSnackbar} = useSnackbar();

    const handleClick = async () => {
        const finalParams = typeof params === 'function' ? params() : params;
        if (!finalParams) return;
        finalParams.export = "excel";

        const snackbarId = showSnackbar('جاري تحميل التقرير', "info")
        let response = method === "get" ? await axiosClient.get(url, {params: finalParams, responseType: "blob"})
            : await axiosClient.post(url, finalParams, {responseType: "blob"})
        if (response.status !== 200) {
            showSnackbar(response.data.message, "error");
        } else {
            let filename = "تقرير" + new Date(Date.now()).toISOString() + ".xlsx";
            if (response.headers["content-disposition"]) {
                const match = response.headers["content-disposition"].match(/filename="?(.+?)"?$/);
                if (match) filename = match[1];
            }

            const blob = new Blob([response.data]);
            const urlBlob = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = urlBlob;
            link.setAttribute("download", filename);

            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(urlBlob);
            showSnackbar("تم تحميل التقرير بنجاح", "success")
        }
    }
    return (
        <>
            <Button
                variant={"contained"}
                color={"success"}
                onClick={handleClick}
            >
                تصدير كملف Excel
            </Button>
        </>
    );
}

