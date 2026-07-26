import Page from "@ui/Page/Page.jsx";
import Form from "@ui/Form/Form.jsx";
import {useCreate, useGetAll} from "@hooks/api/useCrud.js";
import {useSnackbar} from "@contexts/SnackbarContext.jsx";
import {useState, useRef} from "react";
import {StudentHelper} from "@utils/helpers/StudentHelper.js";
import {ClassroomHelper} from "@helpers/ClassroomHelper.js";
import {FormControlLabel, Radio, RadioGroup} from '@mui/material';

const ENTRY_MODES = [
    {label: "الابن الأول", value: "first"},
    {label: "له أخ في المدرسة", value: "sibling"}
]

export default function AddStudents() {
    const creationMutation = useCreate("students");
    const {showSnackbar} = useSnackbar();
    const [serverErrors, setServerErrors] = useState();
    const formStateRef = useRef({});
    const [classroomParameters, setClassroomParameters] = useState({level: "", grade: "", language: ""});
    const [entryMode, setEntryMode] = useState("first");
    const [mixedParentData, setMixedParentData] = useState(null);

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
        let guardianData = null;

        for (const key in data) {
            if (key.startsWith('guardian_') && data['guardian_type'] === 'other') {
                if (!guardianData) guardianData = {};
                guardianData[key.replace('guardian_', '')] = data[key];
            } else if (key.includes('father')) {
                fatherData[key.replace('father_', '')] = data[key];
            } else if (key.includes('mother')) {
                motherData[key.replace("mother_", "")] = data[key];
            } else {
                normalizedData[key] = data[key];
            }
        }
        fatherData.gender = "male";
        motherData.gender = "female";

        const parents = [fatherData, motherData];

        if (guardianData) {
            guardianData.gender = guardianData.gender || "male";
            parents.push(guardianData);
        }

        normalizedData.parents = parents;
        normalizedData.status = "مستجد";
        normalizedData.parent_mode = entryMode;

        if (entryMode === 'mixed' && mixedParentData) {
            normalizedData.existing_nids = mixedParentData.existing.map(g => g.nid);
        }

        return normalizedData;
    }

    const handleEntryModeChange = (e) => {
        setEntryMode(e.target.value);
        setMixedParentData(null);
        setServerErrors(undefined);
    };

    const onFormSubmit = (data, formActions) => {
        setServerErrors(undefined);
        creationMutation.mutate(normalizeData(data), {
            onSuccess: () => {
                showSnackbar("تم إضافة الطالب بنجاح");
                setServerErrors(undefined);
                setMixedParentData(null);
                setEntryMode("first");
                formActions.resetForm();
            },
            onError: (error) => {
                const check = error?.response?.data?.parent_check;
                if (check?.case === 'one_found') {
                    setMixedParentData({
                        existing: check.existing,
                        missing: check.missing,
                    });
                    setEntryMode('mixed');
                    showSnackbar(error?.response?.data?.message, "warning");
                } else if (check?.case === 'none_found') {
                    showSnackbar('لا يوجد سجلات للوالدين', 'error');
                } else {
                    showSnackbar("حدث خطأ أثناء إضافة الطالب", "error");
                    setServerErrors(error?.response?.data?.errors);
                }
            }
        });
    };

    const getFormFields = () => {
        if (entryMode === 'mixed' && mixedParentData) {
            return StudentHelper.getMixedFields(mixedParentData);
        }
        return StudentHelper.getAllFields(entryMode);
    };

    return (
        <Page>
            {entryMode !== 'mixed' && (
                <div style={{marginBottom: 16}}>
                    <RadioGroup
                        row
                        value={entryMode}
                        sx={{
                            display:"flex", gap:"5%"
                        }}
                        onChange={handleEntryModeChange}
                    >
                        {ENTRY_MODES.map((mode) => (
                            <FormControlLabel
                                key={mode.value}
                                value={mode.value}
                                control={<Radio/>}
                                label={mode.label}
                            />
                        ))}
                    </RadioGroup>
                </div>
            )}
            {entryMode === 'mixed' && mixedParentData && (
                <div style={{marginBottom: 16, padding: '8px 16px', backgroundColor: '#fff3cd', borderRadius: 4}}>
                    {mixedParentData.missing.map(g => {
                        const role = g.gender === 'male' ? 'الأب' : 'الأم';
                        return <span key={g.gender}>الرجاء إدخال بيانات {role}</span>;
                    })}
                </div>
            )}
            <Form
                key={entryMode + (mixedParentData ? JSON.stringify(mixedParentData) : '')}
                fields={[...getFormFields(),
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
