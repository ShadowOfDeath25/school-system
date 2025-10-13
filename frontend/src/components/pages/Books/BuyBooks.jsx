import Page from "@ui/Page/Page.jsx";
import Form from "@ui/Form/Form.jsx";
import {ClassroomHelper} from "@helpers/ClassroomHelper.js";
import {SubjectHelper} from "@helpers/SubjectHelper.js";
import {useCreate, useGetAll} from "@hooks/api/useCrud.js";
import {useState} from "react";
import {StudentHelper} from "@helpers/StudentHelper.js";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";

export default function BuyBooks() {
    const [formValues, setFormValues] = useState({
        academic_year: "", level: "", grade: "", semester: "", type: "", student_name: "", quantity: ""
    });
    const {academic_year, level, grade, semester} = formValues;
    const mutation = useCreate('book-purchases')
    const canFetchTypes = !!(academic_year && level && grade && semester);
    const {showSnackbar} = useSnackbar();
    const {data: books, isLoading: isLoadingTypes} = useGetAll('books', {
        types: true, academic_year, level, grade, semester
    }, {
        enabled: canFetchTypes, placeholderData: []
    });

    const onSubmit = (data) => {
        mutation.mutate({
            book_id: data.type, student_name: data.student_name, quantity: data.quantity
        }, {
            onSuccess: () => {
                showSnackbar("تم صرف الكتب بنجاح")
            }, onError: () => {
                showSnackbar("حدث خطأ اثناء صرف الكتب", "error")
            }
        });

    }
    return (<>
        <Page>
            <Form
                values={formValues}
                setValues={setFormValues}
                fields={[ClassroomHelper.FIELDS.ACADEMIC_YEAR, ClassroomHelper.FIELDS.LEVEL, ClassroomHelper.FIELDS.GRADE, SubjectHelper.FIELDS.SEMESTER, {
                    name: 'type',
                    label: 'النسخة',
                    id: 'type',
                    type: 'select',
                    placeholder: 'اختر النسخة',
                    options: books?.data?.map(record => ({label: record.type, value: record.id})),
                    disabled: !canFetchTypes || isLoadingTypes,
                    required: true
                }, {
                    ...StudentHelper.FIELDS.STUDENT.NAME_IN_ARABIC, name: 'student_name', label: 'اسم الطالب'
                }, {
                    name: "quantity", type: "number", required: true, label: "الكمية", placeholder: "الكمية"
                }]}
                onFormSubmit={onSubmit}
            />
        </Page>
    </>);
}
