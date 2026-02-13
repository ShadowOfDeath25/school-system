import styles from './styles.module.css';
import RadioField from "@ui/RadioField/RadioField.jsx";
import SelectField from "@ui/SelectField/SelectField.jsx";
import {useGetAll} from "@hooks/api/useCrud.js";
import {ClassroomHelper} from "@helpers/ClassroomHelper.js";
import InputField from "@ui/InputField/InputField.jsx";
import TextArea from "@ui/TextArea/TextArea.jsx";


export default function TuitionReports({formData, setFormData, academicYears}) {

    const {data: classrooms} = useGetAll("classrooms", {
        all: "true",
        academic_year: formData.academicYear, language: formData.language, level: formData.level, grade: formData.grade
    }, {
        disabled: !(formData.level && formData.grade && formData.language && formData.academicYear)
    });
    const handleChange = (e) => {
        setFormData((prev) => ({...prev, [e.target.name]: e.target.value}))
    }
    return (
        <div className={styles.container}>
            <label>اختر التقرير </label>
            <RadioField
                name={"reportSubType"}

                value={formData.reportSubType}
                handleChange={handleChange}
                options={[
                    {
                        label: "سجلات المصروفات",
                        value: "tuition records"
                    },
                    {
                        label: "متأخرات المصروفات",
                        value: "arrears"
                    },
                    {
                        label: "خطابات متأخرات المصروفات",
                        value: "arrearsLetters"
                    },
                    {
                        label: "خطابات",
                        value: "letters"
                    },
                    {
                        label: "احصائيات المصروفات",
                        value: "stats"
                    },
                    {
                        label: "الاحصائيات اليومية",
                        value: "dailyStats"
                    }

                ]}
            />
            <SelectField
                label={"العام الدراسي"}
                options={academicYears}
                placeholder={"اختر العام الدراسي"}
                value={formData.academicYear}
                handleChange={handleChange}
                name={"academicYear"}
            />
            <SelectField
                label={"اللغة"}
                options={[
                    "عربي", "لغات", "الكل"
                ]}
                placeholder={"اختر اللغة"}
                value={formData.language}
                handleChange={handleChange}
                name={"language"}
            />
            <SelectField
                {...ClassroomHelper.FIELDS.LEVEL}
                value={formData.level}
                handleChange={handleChange}
                name={"level"}
            />
            <SelectField
                {...ClassroomHelper.FIELDS.GRADE}
                options={ClassroomHelper.getGradeOptionsByLevel(formData.level)}
                disabled={!formData.level}
                value={formData.grade}
                handleChange={handleChange}
            />
            <SelectField
                {...ClassroomHelper.FIELDS.CLASSROOM}
                value={formData.classroom_id}
                name={"classroom_id"}
                disabled={!(formData.level && formData.grade && formData.language && formData.academicYear)}
                options={
                    classrooms?.data?.map(classroom => ({label: classroom.name, value: classroom.id}))
                }
                handleChange={handleChange}
            />
            <InputField
                type={"number"}
                min={0}
                label={"الحد الادني"}
                value={formData.min}
                name={"min"}
                handleChange={handleChange}
                placeholder={"الحد الادني"}
            />
            <SelectField
                label={"ترتيب / فرز"}
                value={formData.sorting}
                placeholder={"ترتيب / فرز"}
                handleChange={handleChange}
                name={"sorting"}
                options={[{label: "البنين اولًا", value: "maleFirst"}, {label: "البنات اولًا", value: "femaleFirst"}]}
            />

            {/*<TextArea*/}
            {/*    label={'الخطاب'}*/}
            {/*    name={"letter"}*/}
            {/*    value={formData.letter}*/}
            {/*    handleChange={handleChange}*/}
            {/*    placeholder={"الخطاب"}*/}
            {/*    props={{className:styles.letterArea,id:"x-letter"}}*/}
            {/*/>*/}
            <Activity mode={(formData.reportSubType === "letters" || formData.reportSubType === "arrearsLetters") ? "visible" : "hidden"}>
                <label htmlFor="letter">الخطاب</label>
                <textarea
                    id={"letter"}
                    name={"letter"}
                    value={formData.letter}
                    onChange={handleChange}
                    placeholder={"الخطاب"}
                />
            </Activity>
        </div>
    );
}

