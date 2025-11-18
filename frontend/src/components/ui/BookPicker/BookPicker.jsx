import styles from './styles.module.css'
import {Button} from "@mui/material";
import {useGetAll} from "@hooks/api/useCrud.js";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";

export default function BookPicker({student}) {
    const {data: books, isLoading} = useGetAll('book-purchases', {student_id: student.id})

    if (isLoading){
        return <div className={styles.container}><LoadingScreen/></div>
    }

    return (
        <div className={styles.container}>
            <table>
                <thead>
                    <tr>
                        <th>
                            النسخة
                        </th>
                        <th>
                            الكمية
                        </th>
                        <th>
                            السعر
                        </th>
                        <th>
                            الاجمالي
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        books?.data?.map((book)=>{
                            return (
                                <tr>
                                    {
                                        Object.keys(book).map((data)=><td>{data}</td>)
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <Button
                variant={"contained"}
                sx={{width: "fit-content"}}
            >
                إضافة كتب
            </Button>
        </div>
    );
}

