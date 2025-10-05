import {validator} from "@utils/validator.js";

const NATIONALITIES = ['مصري', 'اجنبي']
const GENDERS = [{label: "ذكر", value: "male"}, {label: "انثي", value: "female"}]
const RELIGIONS = ['مسلم', "مسيحي"]
const NOTES = [{label: "لا يوجد", value: null}, {label: "ابناء عاملين", value: "ابناء عاملين"}, {
    label: "دمج",
    value: "دمج"
}, {label: "يتيم", value: "يتيم"}]
const FIELDS = {
    STUDENT: {
        NAME_IN_ARABIC: {
            name: "name_in_arabic",
            type: "text",
            id: "student_name_in_arabic",
            label: "الاسم",
            placeholder: "الاسم باللغة العربية",
            required: true
        }, BIRTH_DATE: {
            name: "birth_date", type: "date", id: "birth_date", label: "تاريخ الميلاد", required: true,
        }, NID: {
            name: "nid",
            type: "text",
            id: "nid",
            label: "الرقم القومي",
            placeholder: "الرقم القومي",
            required: true,
            validator: validator.students.nid,
            error: "هذا الرقم القومي غير صحيح"
        }, BIRTH_ADDRESS: {
            name: "birth_address",
            type: "text",
            id: "birth_address",
            label: "جهة الميلاد",
            required: true,
            placeholder: 'جهة الميلاد'
        }, NAME_IN_ENGLISH: {
            name: "name_in_english",
            type: "text",
            id: "name_in_english",
            label: "الاسم باللغة الانجليزية",
            required: true,
            placeholder: 'الاسم باللغة الانجليزية'
        }, NATIONALITY: {
            name: "nationality",
            type: "radio",
            id: "nationality",
            label: "الجنسية",
            required: true,
            placeholder: "الجنسية",
            options: GENDERS
        }, GENDER: {
            name: "gender",
            type: "radio",
            id: "gender",
            label: "النوع",
            required: true,
            options: GENDERS,
            error: "الرجاء اختيار النوع"
        }, RELIGION: {
            name: "religion", type: "radio", id: "religion", label: "الديانة", options: RELIGIONS
        }, NOTE: {
            name: "note", type: "select", label: "علامة مميزة", options: NOTES, placeholder: "لا يوجد"
        }
    }, FATHER: {
        NAME: {
            name: "father_name", type: "text", id: "name", label: "الاسم", placeholder: "الاسم"
        }, PHONE_NUMBER: {
            name: 'father_phone_number',
            type: 'text',
            id: "father_phone_number",
            label: "رقم الهاتف",
            placeholder: "رقم الهاتف",
            validator: validator.guardians.phoneNumber,
            error: "رقم الهاتف غير صحيح",

        }, EDU: {
            name: "father_edu", type: "text", id: "father_education", label: "المؤهل", placeholder: "المؤهل"
        }, JOB: {
            name: "father_job", type: "text", id: "father_job", label: "الوظيفة", placeholder: "الوظيفة"
        }
    }, MOTHER: {
        NAME: {
            name: "mother_name", type: "text", id: "name", label: "الاسم", placeholder: "الاسم"
        }, PHONE_NUMBER: {
            name: 'mother_phone_number',
            type: 'text',
            id: "mother_phone_number",
            label: "رقم الهاتف",
            placeholder: "رقم الهاتف",
            validator: validator.guardians.phoneNumber,
            error: "رقم الهاتف غير صحيح",

        }, EDU: {
            name: "mother_edu", type: "text", id: "mother_edu", label: "المؤهل", placeholder: "المؤهل"
        }, JOB: {
            name: "mother_job", type: "text", id: "mother_job", label: "الوظيفة", placeholder: "الوظيفة"
        }
    }
}
export const studentHelper = {
    NATIONALITIES,
    GENDERS,
    RELIGIONS,
    NOTES,
    FIELDS,
    getAllFields: () => {
        return [
            {
                title: "بيانات التلميذ",
                fields: Object.values(studentHelper.FIELDS.STUDENT)
            },
            {
                title: "بيانات الاب",
                fields: Object.values(studentHelper.FIELDS.FATHER)
            },
            {
                title: "بيانات الام",
                fields: Object.values(studentHelper.FIELDS.MOTHER)
            }
        ]
    }
}
