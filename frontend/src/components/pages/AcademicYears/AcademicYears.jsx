import Page from "@ui/Page/Page.jsx";
import styles from './styles.module.css';
import Form from "@ui/Form/Form.jsx";
import {useState} from "react";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import Table from "@ui/Table/Table.jsx";
import {useCreate} from "@hooks/api/useCrud.js";
import ActivateAcademicYearButton from "@ui/ActivateAcademicYearButton/ActivateAcademicYearButton.jsx";


export default function AcademicYears() {
    const [startYear, setStartYear] = useState(new Date().getFullYear());
    const mutation = useCreate('academic-years');
    const {showSnackbar} = useSnackbar();
    const activateButton = {
        header: "تعيين كالعام الدراسي الحالي",
        content: (row) => <ActivateAcademicYearButton row={row}/>
    }

    const onSubmit = (e) => {
        e.preventDefault();
        mutation.mutate({
                name: `${startYear + 1}/${startYear}`
            },
            {
                onSuccess: () => {
                    showSnackbar('تم إضافة عام دراسي جديد بنجاح')
                },
                onError: (error) => {
                    showSnackbar(error?.response?.data?.message, 'error')
                }
            }
        )

    }
    return (<>
        <Page>
            <form className={styles.container} onSubmit={onSubmit}>
                <h3 className={styles.title}>
                    اضافة عام دراسي جديد
                </h3>
                <div className={styles.formInputs}>

                    <div className={styles.inputWrapper}>
                        <label htmlFor={'start-year'}>العام الدراسي</label>
                        <div className={styles.inputGroup}>
                            <input
                                min={1800}
                                max={9999}
                                onChange={(e) => setStartYear(Number(e.target.value))}
                                value={startYear}
                                type="number"
                                style={{padding: '5px', borderRadius: '4px', border: '1px solid #ccc'}}
                            />
                            <span style={{margin: '0 5px'}}>/</span>
                            <input
                                id={'start-year'}
                                type="number"
                                value={startYear + 1}
                                disabled={true}
                                style={{padding: '5px', borderRadius: '4px', border: '1px solid #ccc'}}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.buttons}>
                    <button type="submit">اضافة</button>
                </div>
            </form>
            <Table
                resource={'academic-years'}
                editable={false}
                deletable={false}
                fields={[{name: "name", label: "العام الدراسي"}, {name: "active", label: "الحالي"}]}
            >
                {activateButton}
            </Table>

        </Page>
    </>);
}

