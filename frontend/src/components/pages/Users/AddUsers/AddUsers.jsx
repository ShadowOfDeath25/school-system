import Page from "@ui/Page/Page.jsx";
import {validator} from "@hooks/useValidator.js";
import Form from "@ui/Form/Form.jsx";
import {useEffect, useState} from "react";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import styles from './styles.module.css'
import {useCreate, useGetAll} from "@hooks/api/useCrud.js";
import LoadingScreen from "@ui/LoadingScreen/LoadingScreen.jsx";


export default function AddUser() {
    const {mutate, isError, error} = useCreate("users");
    const {data: roles, isLoading} = useGetAll("roles")
    const [serverErrors, setServerErrors] = useState(null);
    const {showSnackbar} = useSnackbar()

    useEffect(() => {
        if (isError) {
            showSnackbar("حدث خطأ أثناء إضافة المستخدم", "error");
            if (error?.response?.data?.errors) {
                setServerErrors(error.response.data.errors);
            }
        }
    }, [isError, error, showSnackbar]);


    const normalizedRoles = roles?.data.map((role) => {
        return {value: role?.name, label: role?.name}
    })

    const fields = [
        {
            name: "email",
            placeholder: "البريد الإلكتروني",
            type: "text",
            validator: validator.users.email,
            label: 'البريد الإلكتروني',
            required: true,
            id: 'email',
            error: 'البريد الإلكتروني غير صالح'
        },
        {
            name: "name",
            placeholder: "الاسم",
            type: "text",
            label: 'الاسم',
            required: true,
            id: 'name'
        },
        {
            name: "password",
            placeholder: "كلمة المرور",
            type: "password",
            validator: validator.users.password,
            label: 'كلمة المرور',
            required: true,
            id: 'password',
            error: 'كلمة المرور غير صالحه'
        },
        {
            name: "password_confirmation",
            placeholder: 'تأكيد كلمة المرور',
            type: "password",
            label: 'تأكيد كلمة المرور',
            id: 'password_confirmation',
            required: true,
            error: 'كلمتان المرور غير متطابقتان',
            validator: validator.users.confirmPassword,
        },
        {
            name: "role",
            type: "select",
            label: "الصلاحية",
            placeholder: "اختر صلاحية ...",
            id: "role",
            required: true,
            error: "الرجاء اختيار صلاحية",
            validator: (value) => value !== "",
            options: normalizedRoles

        }
    ]
    if (isLoading) {
        return <LoadingScreen/>
    }
    const onFormSubmit = (data) => {
        setServerErrors(null);
        mutate(data, {
            onSuccess: () => {
                showSnackbar("تم إضافة المستخدم بنجاح");
                setServerErrors(null);
            }
        });
    }

    return (
        <Page
            title="اضافة مستخدم"
            breadcrumbs={[<span>المستخدمين</span>, <span>اضافة مستخدم</span>]}
        >
            <Form fields={fields} onFormSubmit={onFormSubmit} serverErrors={serverErrors}/>
            <div className={styles.instructions}>
                <h3>تعليمات كلمة المرور:</h3>
                <span>يجب ان تحتوي كلمة المرور علي الاقل علي كلٍ من:</span>
                <ul>
                    <li>8 رموز (حروف او ارقام او علامات)</li>
                    <li>حرف كبير (A,B,C,...)</li>
                    <li>حرف صغير (a,b,c,...)</li>
                    <li>رقم</li>
                    <li>علامة من العلامات الآتية (@$!%*#?&)</li>
                </ul>
            </div>
        </Page>

    );
}
