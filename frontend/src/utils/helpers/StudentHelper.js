import {validator} from "@utils/validator.js";
import {ClassroomHelper} from "@helpers/ClassroomHelper.js";

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
        },
        LEVEL: {
            ...ClassroomHelper.FIELDS.LEVEL
        },
        GRADE: {
            ...ClassroomHelper.FIELDS.GRADE
        }
        , NATIONALITY: {
            name: "nationality",
            type: "radio",
            id: "nationality",
            label: "الجنسية",
            required: true,
            placeholder: "الجنسية",
            options: NATIONALITIES
        }
        ,
        GENDER: {
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
        },
        LANGUAGE: {
            name: "language",
            label: "اللغة",
            placeholder: "اختر اللغة",
            type: "radio",
            required: true,
            options: ClassroomHelper.LANGUAGES
        },


    }, FATHER: {
        NAME: {
            name: "father_name", type: "text", id: "name", label: "الاسم", placeholder: "الاسم"
        }, NID: {
            name: "father_nid",
            type: "text",
            id: "father_nid",
            label: "الرقم القومي",
            placeholder: "الرقم القومي",
            required: true,
            validator: validator.students.nid,
            error: "هذا الرقم القومي غير صحيح"
        }, PHONE_NUMBER: {
            name: 'father_phone_number',
            type: 'text',
            id: "father_phone_number",
            label: "رقم الهاتف",
            placeholder: "رقم الهاتف",
            validator: validator.parents.phoneNumber,
            error: "رقم الهاتف غير صحيح",

        }, EDU: {
            name: "father_edu", type: "text", id: "father_education", label: "المؤهل", placeholder: "المؤهل"
        }, JOB: {
            name: "father_job", type: "text", id: "father_job", label: "الوظيفة", placeholder: "الوظيفة"
        }
    }, MOTHER: {
        NAME: {
            name: "mother_name", type: "text", id: "name", label: "الاسم", placeholder: "الاسم"
        }, NID: {
            name: "mother_nid",
            type: "text",
            id: "mother_nid",
            label: "الرقم القومي",
            placeholder: "الرقم القومي",
            required: true,
            validator: validator.students.nid,
            error: "هذا الرقم القومي غير صحيح"
        }, PHONE_NUMBER: {
            name: 'mother_phone_number',
            type: 'text',
            id: "mother_phone_number",
            label: "رقم الهاتف",
            placeholder: "رقم الهاتف",
            validator: validator.parents.phoneNumber,
            error: "رقم الهاتف غير صحيح",

        }, EDU: {
            name: "mother_edu", type: "text", id: "mother_edu", label: "المؤهل", placeholder: "المؤهل"
        }, JOB: {
            name: "mother_job", type: "text", id: "mother_job", label: "الوظيفة", placeholder: "الوظيفة"
        }
    },
    FATHER_NID_ONLY: {
        NID: {
            name: "father_nid",
            type: "text",
            id: "father_nid",
            label: "الرقم القومي للاب",
            placeholder: "الرقم القومي للاب",
            required: true,
            validator: validator.students.nid,
            error: "هذا الرقم القومي غير صحيح"
        }
    },
    MOTHER_NID_ONLY: {
        NID: {
            name: "mother_nid",
            type: "text",
            id: "mother_nid",
            label: "الرقم القومي للام",
            placeholder: "الرقم القومي للام",
            required: true,
            validator: validator.students.nid,
            error: "هذا الرقم القومي غير صحيح"
        }
    },
    GUARDIAN_TYPE: {
        name: "guardian_type",
        type: "radio",
        id: "guardian_type",
        label: "ولي الأمر الأساسي",
        required: true,
        options: [
            {label: "الأب", value: "father"},
            {label: "الأم", value: "mother"},
            {label: "شخص آخر", value: "other"}
        ]
    },
    GUARDIAN_OTHER: {
        NAME: {
            name: "guardian_name", type: "text", id: "guardian_other_name", label: "الاسم", placeholder: "الاسم",
            visible: (formData) => formData?.guardian_type === 'other'
        },
        NID: {
            name: "guardian_nid",
            type: "text",
            id: "guardian_other_nid",
            label: "الرقم القومي",
            placeholder: "الرقم القومي",
            validator: validator.students.nid,
            error: "هذا الرقم القومي غير صحيح",
            visible: (formData) => formData?.guardian_type === 'other'
        },
        PHONE_NUMBER: {
            name: 'guardian_phone_number',
            type: 'text',
            id: "guardian_other_phone",
            label: "رقم الهاتف",
            placeholder: "رقم الهاتف",
            validator: validator.parents.phoneNumber,
            error: "رقم الهاتف غير صحيح",
            visible: (formData) => formData?.guardian_type === 'other'
        },
        JOB: {
            name: "guardian_job", type: "text", id: "guardian_other_job", label: "الوظيفة", placeholder: "الوظيفة",
            visible: (formData) => formData?.guardian_type === 'other'
        },
        EDU: {
            name: "guardian_edu", type: "text", id: "guardian_other_edu", label: "المؤهل", placeholder: "المؤهل",
            visible: (formData) => formData?.guardian_type === 'other'
        },
        RELATIONSHIP: {
            name: "guardian_relationship",
            type: "text",
            id: "guardian_other_relationship",
            label: "صلة القرابة",
            placeholder: "مثال: جد، عم، خال",
            visible: (formData) => formData?.guardian_type === 'other'
        },
    }
}
export const StudentHelper = {
    NATIONALITIES,
    GENDERS,
    RELIGIONS,
    NOTES,
    FIELDS,
    getAllFields: (mode = 'first') => {
        const fatherFields = mode === 'sibling'
            ? Object.values(StudentHelper.FIELDS.FATHER_NID_ONLY)
            : Object.values(StudentHelper.FIELDS.FATHER);
        const motherFields = mode === 'sibling'
            ? Object.values(StudentHelper.FIELDS.MOTHER_NID_ONLY)
            : Object.values(StudentHelper.FIELDS.MOTHER);

        return [
            {
                title: "بيانات التلميذ",
                fields: Object.values(StudentHelper.FIELDS.STUDENT)
            },
            {
                title: "بيانات الاب",
                fields: fatherFields
            },
            {
                title: "بيانات الام",
                fields: motherFields
            },
            {
                title: "ولي الأمر الأساسي",
                fields: [
                    StudentHelper.FIELDS.GUARDIAN_TYPE,
                    ...Object.values(StudentHelper.FIELDS.GUARDIAN_OTHER)
                ]
            }
        ]
    },
    getMixedFields: (mixedData) => {
        const existing = mixedData.existing[0];
        const missing = mixedData.missing[0];
        const existingRole = existing.gender === 'male' ? 'الأب' : 'الأم';
        const missingRole = missing.gender === 'male' ? 'الأب' : 'الأم';
        const missingPrefix = missing.gender === 'male' ? 'father' : 'mother';
        const existingPrefix = existing.gender === 'male' ? 'father' : 'mother';

        const missingFields = missing.gender === 'male'
            ? Object.values(StudentHelper.FIELDS.FATHER)
            : Object.values(StudentHelper.FIELDS.MOTHER);

        const missingFieldsWithNid = missingFields.map(f => {
            if (f.name === `${missingPrefix}_nid`) {
                return {...f, value: missing.nid};
            }
            return f;
        });

        return [
            {
                title: "بيانات التلميذ",
                fields: Object.values(StudentHelper.FIELDS.STUDENT)
            },
            {
                title: `بيانات ${existingRole} (موجود)`,
                fields: [
                    {
                        name: `${existingPrefix}_nid`,
                        type: "text",
                        label: `الرقم القومي لل${existingRole}`,
                        value: existing.nid,
                        disabled: true,
                        required: true,
                    }
                ]
            },
            {
                title: `بيانات ${missingRole} (مطلوب)`,
                fields: missingFieldsWithNid
            },
            {
                title: "ولي الأمر الأساسي",
                fields: [
                    StudentHelper.FIELDS.GUARDIAN_TYPE,
                    ...Object.values(StudentHelper.FIELDS.GUARDIAN_OTHER)
                ]
            }
        ]
    }
}
