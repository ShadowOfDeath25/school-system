import Page from "@ui/Page/Page.jsx";
import Form from "@ui/Form/Form.jsx";
import {useCreate, useGetAll} from "@hooks/api/useCrud.js";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import {useState, useRef} from "react";
import {StudentHelper} from "@utils/helpers/StudentHelper.js";
import {ClassroomHelper} from "@helpers/ClassroomHelper.js";

export default function AddStudents() {
    const creationMutation = useCreate("students");
    const {showSnackbar} = useSnackbar();
    const [serverErrors, setServerErrors] = useState();
    const formStateRef = useRef({});
    const [classroomParameters, setClassroomParameters] = useState({level: "", grade: "", language: ""});

    const {data: classrooms} = useGetAll("classrooms", {
        isActive: true,
        level: classroomParameters.level,
        grade: classroomParameters.grade,
        language: classroomParameters.language,
        all: true
    }, {
        enabled: !!(classroomParameters.level && classroomParameters.grade && classroomParameters.language),
        select: (data) => data?.data.map(classroom => ({
            label: `${classroom.name}` + "    " + " (نسبة الإشغال " + classroom.occupancy + ")",
            value: classroom.id
        }))
    });
    console.log(classrooms ?? "no classrooms")

    const handleFormDataChange = (newData) => {
        if (newData.level !== classroomParameters.level || newData.grade !== classroomParameters.grade || newData.language !== classroomParameters.language) {
            setClassroomParameters({level: newData.level, grade: newData.grade, language: newData.language});
        }
    };

    const normalizeData = (data) => {
        const normalizedData = {}
        const fatherData = {}
        const motherData = {}
        for (const key in data) {
            if (key.includes('father')) {
                fatherData[key.replace('father_', '')] = data[key];
            } else if (key.includes('mother')) {
                motherData[key.replace("mother_", "")] = data[key];
            } else {
                normalizedData[key] = data[key];
            }
        }
        fatherData.gender = "male";
        motherData.gender = "female";
        normalizedData.guardians = [fatherData, motherData];
        normalizedData.status = "مستجد";
        return normalizedData;
    }

    const onFormSubmit = (data, formActions) => {
        setServerErrors(undefined);
        creationMutation.mutate(normalizeData(data), {
            onSuccess: () => {
                showSnackbar("تم إضافة الطالب بنجاح");
                setServerErrors(undefined);
                formActions.resetForm();
            },
            onError: (error) => {
                showSnackbar("حدث خطأ أثناء إضافة الطالب", "error");
                setServerErrors(error?.response?.data?.errors);
            }
        });
    };

    return (
        <Page>
            <Form
                fields={[...StudentHelper.getAllFields(),
                    {
                        title: "الحاق بفصل",
                        fields: [
                            {
                                ...ClassroomHelper.FIELDS.CLASSROOM,
                                options: classrooms,
                                name: "classroom_id",
                                dependency: ["grade", "level", "language"],
                                multiple: false

                            }
                        ]
                    }
                ]}
                serverErrors={serverErrors}
                onFormSubmit={onFormSubmit}
                formStateRef={formStateRef}
                onFormDataChange={handleFormDataChange}
            />
        </Page>
    );
}
