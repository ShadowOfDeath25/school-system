import {useUpdate} from "@hooks/api/useCrud.js";
import {Button} from "@mui/material";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import {useConfirmModal} from "@contexts/ConfirmModalContext.jsx";

export default function WithdrawButton({student, children}) {
    const mutation = useUpdate('students');
    const {showSnackbar} = useSnackbar();
    const {confirm} = useConfirmModal();
    const handleWithdraw = async (student) => {
        const confirmed = await confirm({message: "هل أنت متأكد من سحب ملف هذا الطالب ؟"})
        if (confirmed) {
            mutation.mutate({id: student.id, withdrawn: true, status: "تم سحب ملفه", classroom_id: null}, {
                onSuccess: () => {
                    showSnackbar("تم سحب ملف الطالب بنجاح")
                },
                onError: () => {
                    showSnackbar("حدث خطأ أثناء سحب الملف", "error")
                }
            })
        }
    }
    return (
        <>
            <Button
                onClick={() => handleWithdraw(student)}
                variant={"contained"}
                sx={{backgroundColor: "var(--color-danger)"}}
            >
                {children ? children : "سحب الملف"}
            </Button>
        </>
    );
}

