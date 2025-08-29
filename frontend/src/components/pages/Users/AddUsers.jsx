import Page from "@ui/Page/Page.jsx";
import {validator} from "@hooks/useValidator.js";
import Form from "@ui/Form/Form.jsx";
import {useCreateUser} from "@hooks/api/users.js";

export default function AddUser() {
    const {mutate,isSuccess} = useCreateUser()
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
            id: "role",
            required: true,
            error: "الرجاء اختيار صلاحية",
            validator: (value) => value !== "",
            options: [
                {value: "", label: "اختر صلاحية...", disabled: true},
                {value: "admin", label: "مدير"},
                {value: "editor", label: "محرر"},
            ]
        }
    ]
    const onFormSubmit = (data) => {
        mutate(data);
    }
    if (isSuccess){
        console.log("User Added Successfully")
    }
    return (
        <Page
            title="اضافة مستخدم"
            breadcrumbs={[<span>المستخدمين</span>, <span>اضافة مستخدم</span>]}
        >
            <Form fields={fields} onFormSubmit={onFormSubmit}/>
        </Page>
    );
}
